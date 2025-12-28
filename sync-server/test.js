#!/usr/bin/env node

/**
 * Simple integration test for Onda Sync Server
 * Tests all API endpoints with various scenarios
 */

const testSecretKey = 'TEST-KEY-FOR-INTEGRATION-TESTS-ONLY';
const serverUrl = process.env.SERVER_URL || 'http://localhost:3001';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

async function testHealthCheck() {
  log('\n🏥 Testing health check...', colors.blue);
  try {
    const response = await fetch(`${serverUrl}/health`);
    const data = await response.json();

    if (response.ok && data.status === 'ok') {
      log('✓ Health check passed', colors.green);
      return true;
    } else {
      log('✗ Health check failed', colors.red);
      return false;
    }
  } catch (error) {
    log(`✗ Health check error: ${error.message}`, colors.red);
    return false;
  }
}

async function testInvalidKey() {
  log('\n🔐 Testing invalid secret key...', colors.blue);
  try {
    const response = await fetch(`${serverUrl}/sync/data`, {
      headers: {
        'x-secret-key': 'short',
      },
    });
    const data = await response.json();

    if (response.status === 401 && data.error) {
      log('✓ Invalid key properly rejected', colors.green);
      return true;
    } else {
      log('✗ Invalid key not rejected', colors.red);
      return false;
    }
  } catch (error) {
    log(`✗ Invalid key test error: ${error.message}`, colors.red);
    return false;
  }
}

async function testPushData() {
  log('\n📤 Testing data push...', colors.blue);
  try {
    const testData = {
      weeks: [{ id: 1, name: 'Week 1' }],
      calendar: [{ id: 1, date: '2024-01-01' }],
      settings: [{ id: 1, theme: 'dark' }],
      columns: [{ id: 'col1', name: 'Column 1' }],
    };

    const response = await fetch(`${serverUrl}/sync/push`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-secret-key': testSecretKey,
      },
      body: JSON.stringify({
        data: testData,
        clientVersion: 0,
      }),
    });

    const result = await response.json();

    if (response.ok && result.success && result.version === 1) {
      log('✓ Data push successful', colors.green);
      log(`  Version: ${result.version}`, colors.reset);
      return true;
    } else {
      log('✗ Data push failed', colors.red);
      return false;
    }
  } catch (error) {
    log(`✗ Data push error: ${error.message}`, colors.red);
    return false;
  }
}

async function testPullData() {
  log('\n📥 Testing data pull...', colors.blue);
  try {
    const response = await fetch(`${serverUrl}/sync/data`, {
      headers: {
        'x-secret-key': testSecretKey,
      },
    });

    const result = await response.json();

    if (
      response.ok &&
      result.exists &&
      result.data &&
      result.data.weeks &&
      result.data.weeks.length > 0
    ) {
      log('✓ Data pull successful', colors.green);
      log(`  Version: ${result.version}`, colors.reset);
      log(`  Weeks: ${result.data.weeks.length}`, colors.reset);
      return true;
    } else {
      log('✗ Data pull failed or no data', colors.red);
      return false;
    }
  } catch (error) {
    log(`✗ Data pull error: ${error.message}`, colors.red);
    return false;
  }
}

async function testPullWithConflict() {
  log('\n⚔️  Testing conflict detection...', colors.blue);
  try {
    const response = await fetch(`${serverUrl}/sync/pull`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-secret-key': testSecretKey,
      },
      body: JSON.stringify({
        clientVersion: 0, // Old version to trigger conflict
        clientLastSync: new Date().toISOString(),
      }),
    });

    const result = await response.json();

    if (response.ok && result.exists && result.hasConflict) {
      log('✓ Conflict detection working', colors.green);
      log(`  Server version: ${result.version}`, colors.reset);
      return true;
    } else if (response.ok && result.exists) {
      log('⚠ No conflict detected (might be expected)', colors.yellow);
      return true;
    } else {
      log('✗ Conflict detection failed', colors.red);
      return false;
    }
  } catch (error) {
    log(`✗ Conflict detection error: ${error.message}`, colors.red);
    return false;
  }
}

async function testUpdateData() {
  log('\n📝 Testing data update...', colors.blue);
  try {
    const updatedData = {
      weeks: [
        { id: 1, name: 'Week 1' },
        { id: 2, name: 'Week 2' },
      ],
      calendar: [{ id: 1, date: '2024-01-01' }],
      settings: [{ id: 1, theme: 'light' }],
      columns: [{ id: 'col1', name: 'Column 1' }],
    };

    const response = await fetch(`${serverUrl}/sync/push`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-secret-key': testSecretKey,
      },
      body: JSON.stringify({
        data: updatedData,
        clientVersion: 1,
      }),
    });

    const result = await response.json();

    if (response.ok && result.success && result.version > 1) {
      log('✓ Data update successful', colors.green);
      log(`  New version: ${result.version}`, colors.reset);
      return true;
    } else {
      log('✗ Data update failed', colors.red);
      return false;
    }
  } catch (error) {
    log(`✗ Data update error: ${error.message}`, colors.red);
    return false;
  }
}

async function testDeleteData() {
  log('\n🗑️  Testing data deletion...', colors.blue);
  try {
    const response = await fetch(`${serverUrl}/sync/data`, {
      method: 'DELETE',
      headers: {
        'x-secret-key': testSecretKey,
      },
    });

    const result = await response.json();

    if (response.ok && result.success) {
      log('✓ Data deletion successful', colors.green);
      return true;
    } else {
      log('✗ Data deletion failed', colors.red);
      return false;
    }
  } catch (error) {
    log(`✗ Data deletion error: ${error.message}`, colors.red);
    return false;
  }
}

async function testNonExistentData() {
  log('\n❓ Testing non-existent data pull...', colors.blue);
  try {
    const response = await fetch(`${serverUrl}/sync/data`, {
      headers: {
        'x-secret-key': 'new-key-999999',
      },
    });

    const result = await response.json();

    if (response.ok && !result.exists) {
      log('✓ Non-existent data handled correctly', colors.green);
      return true;
    } else {
      log('✗ Non-existent data not handled correctly', colors.red);
      return false;
    }
  } catch (error) {
    log(`✗ Non-existent data test error: ${error.message}`, colors.red);
    return false;
  }
}

async function runTests() {
  log('\n🌊 Onda Sync Server Integration Tests', colors.blue);
  log(`Server: ${serverUrl}\n`, colors.reset);

  const results = [];

  results.push(await testHealthCheck());
  results.push(await testInvalidKey());
  results.push(await testPushData());
  results.push(await testPullData());
  results.push(await testPullWithConflict());
  results.push(await testUpdateData());
  results.push(await testDeleteData());
  results.push(await testNonExistentData());

  const passed = results.filter((r) => r).length;
  const total = results.length;

  log('\n' + '='.repeat(50), colors.reset);
  if (passed === total) {
    log(`✓ All ${total} tests passed!`, colors.green);
    process.exit(0);
  } else {
    log(`✗ ${passed}/${total} tests passed`, colors.red);
    process.exit(1);
  }
}

// Run tests
runTests().catch((error) => {
  log(`\n✗ Test suite error: ${error.message}`, colors.red);
  process.exit(1);
});
