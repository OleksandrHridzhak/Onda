import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const sourceRoot = join(process.cwd(), 'src', 'render', 'src');
const layers = ['app', 'pages', 'widgets', 'features', 'entities', 'shared'];
const layerRank = new Map([
    ['shared', 0],
    ['entities', 1],
    ['features', 2],
    ['widgets', 3],
    ['pages', 4],
    ['app', 5],
]);
const importPattern =
    /\b(?:import|export)\s+(?:type\s+)?(?:[^'"]*?\s+from\s+)?['"]([^'"]+)['"]/g;

function listSourceFiles(directory) {
    return readdirSync(directory).flatMap((entry) => {
        const path = join(directory, entry);
        const stat = statSync(path);

        if (stat.isDirectory()) return listSourceFiles(path);
        if (/\.(ts|tsx)$/.test(entry)) return [path];
        return [];
    });
}

function getSourceInfo(filePath) {
    const parts = relative(sourceRoot, filePath).split(sep);
    const [layer, slice] = parts;

    return { layer, slice };
}

function parseAliasImport(specifier) {
    const [layer, slice, ...rest] = specifier.split('/');

    if (!layers.includes(layer)) return null;
    return { layer, slice, rest };
}

function isExternalSliceImport(source, target) {
    if (!['pages', 'widgets', 'features', 'entities'].includes(target.layer)) {
        return false;
    }

    return source.layer !== target.layer || source.slice !== target.slice;
}

const violations = [];
const entityUiAllowList = new Set();

for (const file of listSourceFiles(sourceRoot)) {
    const source = getSourceInfo(file);
    const sourceRank = layerRank.get(source.layer);
    const text = readFileSync(file, 'utf8');
    const relativeFile = relative(sourceRoot, file).split(sep).join('/');

    if (
        source.layer === 'entities' &&
        relativeFile.includes('/ui/') &&
        !entityUiAllowList.has(relativeFile)
    ) {
        violations.push({
            file,
            specifier: relativeFile,
            reason: 'entity UI must be explicitly allowed',
        });
    }

    if (source.layer === 'entities' && /\bcreateContext\s*\(/.test(text)) {
        violations.push({
            file,
            specifier: 'createContext',
            reason: 'entities cannot own React context',
        });
    }

    for (const match of text.matchAll(importPattern)) {
        const target = parseAliasImport(match[1]);
        if (!target || sourceRank === undefined) continue;

        const targetRank = layerRank.get(target.layer);
        if (targetRank > sourceRank) {
            violations.push({
                file,
                specifier: match[1],
                reason: `${source.layer} cannot import ${target.layer}`,
            });
            continue;
        }

        if (
            target.layer === source.layer &&
            source.slice !== target.slice &&
            ['pages', 'widgets', 'features', 'entities'].includes(target.layer)
        ) {
            violations.push({
                file,
                specifier: match[1],
                reason: `cross-slice ${target.layer} import must go through a lower layer`,
            });
            continue;
        }

        if (
            target.layer === source.layer &&
            source.slice === target.slice &&
            ['pages', 'widgets', 'features', 'entities'].includes(target.layer)
        ) {
            violations.push({
                file,
                specifier: match[1],
                reason: 'internal slice import must be relative',
            });
            continue;
        }

        if (isExternalSliceImport(source, target) && target.rest.length > 0) {
            violations.push({
                file,
                specifier: match[1],
                reason: 'external slice import must use public index.ts',
            });
        }
    }
}

if (violations.length > 0) {
    for (const violation of violations) {
        console.error(
            `${relative(process.cwd(), violation.file)} imports "${violation.specifier}": ${violation.reason}`,
        );
    }

    process.exit(1);
}
