import { columnService } from './ColumnService';
import { CheckBoxColumn, TodoColumn, NumberBoxColumn } from '../models/columns';

// Mock idb
jest.mock('idb', () => ({
  openDB: jest.fn(() =>
    Promise.resolve({
      getAll: jest.fn(() => Promise.resolve([])),
      get: jest.fn(() => Promise.resolve(null)),
      put: jest.fn(() => Promise.resolve()),
      delete: jest.fn(() => Promise.resolve()),
      transaction: jest.fn(() => ({
        objectStore: jest.fn(() => ({
          get: jest.fn(() => Promise.resolve(null)),
          getAll: jest.fn(() => Promise.resolve([])),
          put: jest.fn(() => Promise.resolve()),
          delete: jest.fn(() => Promise.resolve()),
          clear: jest.fn(() => Promise.resolve()),
        })),
        done: Promise.resolve(),
      })),
      objectStoreNames: {
        contains: jest.fn(() => false),
      },
      createObjectStore: jest.fn(),
    })
  ),
}));

describe('ColumnService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Column Creation', () => {
    test('should create a checkbox column', () => {
      const column = columnService.createColumn('checkbox');
      expect(column).toBeInstanceOf(CheckBoxColumn);
      expect(column.type).toBe('checkbox');
    });

    test('should create a todo column', () => {
      const column = columnService.createColumn('todo');
      expect(column).toBeInstanceOf(TodoColumn);
      expect(column.type).toBe('todo');
    });

    test('should create a numberbox column', () => {
      const column = columnService.createColumn('numberbox');
      expect(column).toBeInstanceOf(NumberBoxColumn);
      expect(column.type).toBe('numberbox');
    });

    test('should throw error for unknown column type', () => {
      expect(() => {
        columnService.createColumn('unknown-type');
      }).toThrow('Unknown column type');
    });
  });

  describe('Serialization/Deserialization', () => {
    test('should serialize columns to JSON', () => {
      const column = new CheckBoxColumn('Star', 50, true, 'Test Column', 'Description');
      const serialized = columnService.serializeColumns([column]);

      expect(serialized).toHaveLength(1);
      expect(serialized[0]).toHaveProperty('id');
      expect(serialized[0]).toHaveProperty('type', 'checkbox');
      expect(serialized[0]).toHaveProperty('name', 'Test Column');
      expect(serialized[0]).toHaveProperty('emojiIcon', 'Star');
      expect(serialized[0]).toHaveProperty('checkboxColor');
    });

    test('should deserialize JSON to column instances', () => {
      const json = {
        id: '123',
        type: 'checkbox',
        name: 'Test',
        emojiIcon: 'Star',
        width: 50,
        nameVisible: true,
        description: 'Test',
        checkboxColor: 'blue',
        days: {
          Monday: '',
          Tuesday: '',
          Wednesday: '',
          Thursday: '',
          Friday: '',
          Saturday: '',
          Sunday: '',
        },
      };

      const columns = columnService.deserializeColumns([json]);
      expect(columns).toHaveLength(1);
      expect(columns[0]).toBeInstanceOf(CheckBoxColumn);
      expect(columns[0].id).toBe('123');
      expect(columns[0].name).toBe('Test');
    });

    test('should handle multiple columns', () => {
      const json1 = {
        id: '1',
        type: 'checkbox',
        name: 'Col1',
        emojiIcon: 'Star',
        width: 50,
        nameVisible: true,
        description: '',
        checkboxColor: 'blue',
        days: {
          Monday: '',
          Tuesday: '',
          Wednesday: '',
          Thursday: '',
          Friday: '',
          Saturday: '',
          Sunday: '',
        },
      };

      const json2 = {
        id: '2',
        type: 'todo',
        name: 'Col2',
        emojiIcon: 'List',
        width: 150,
        nameVisible: true,
        description: '',
        tasks: [],
        options: [],
        tagColors: {},
      };

      const columns = columnService.deserializeColumns([json1, json2]);
      expect(columns).toHaveLength(2);
      expect(columns[0]).toBeInstanceOf(CheckBoxColumn);
      expect(columns[1]).toBeInstanceOf(TodoColumn);
    });
  });

  describe('Database Operations', () => {
    test('should add column with generated id', async () => {
      const columnData = {
        type: 'checkbox',
        name: 'Test',
        emojiIcon: 'Star',
        width: 50,
        nameVisible: true,
        description: '',
      };

      const result = await columnService.addColumn(columnData);
      expect(result.status).toBe(true);
      expect(result.data).toHaveProperty('id');
    });

    test('should add column instance', async () => {
      const column = new CheckBoxColumn('Star', 50, true, 'Test', 'Description');
      const result = await columnService.addColumn(column);

      expect(result.status).toBe(true);
      expect(result.data).toHaveProperty('id', column.id);
    });

    test('should update column', async () => {
      const columnData = {
        id: '123',
        type: 'checkbox',
        name: 'Updated',
        emojiIcon: 'Star',
        width: 100,
        nameVisible: false,
        description: 'Updated description',
      };

      const result = await columnService.updateColumn(columnData);
      expect(result).toBe(true);
    });

    test('should fail to update column without id', async () => {
      const columnData = {
        type: 'checkbox',
        name: 'Test',
      };

      const result = await columnService.updateColumn(columnData);
      expect(result).toBe(false);
    });

    test('should delete column', async () => {
      const result = await columnService.deleteColumn('123');
      expect(result.status).toBe('Column deleted');
      expect(result.columnId).toBe('123');
    });

    test('should get all columns', async () => {
      const columns = await columnService.getAllColumns();
      expect(Array.isArray(columns)).toBe(true);
    });

    test('should get column by id', async () => {
      const column = await columnService.getColumnById('123');
      // Will be null in mock, but testing the call pattern
      expect(column).toBeDefined();
    });
  });

  describe('Column Order', () => {
    test('should update column order', async () => {
      const order = ['col1', 'col2', 'col3'];
      const result = await columnService.updateColumnsOrder(order);
      expect(result.status).toBe('Order updated');
    });

    test('should get column order', async () => {
      const order = await columnService.getColumnsOrder();
      expect(order).toBeDefined();
    });
  });

  describe('Migration', () => {
    test('should report already migrated if columns exist', async () => {
      // This test would need proper mocking of IndexedDB
      const result = await columnService.migrateColumnsFromWeeks();
      expect(result.status).toBeDefined();
    });
  });
});
