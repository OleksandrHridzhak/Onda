import { getCollection } from '../database/mongodb.js';

/**
 * Get sync data - pull from server
 */
export async function getData(req, res) {
  try {
    const { secretKey } = req;
    const collection = getCollection();
    const doc = await collection.findOne({ secretKey });

    if (!doc) {
      return res.json({
        exists: false,
        message: 'No data found for this key',
      });
    }

    res.json({
      exists: true,
      data: doc.content,
      lastSync: doc.lastSync,
      version: doc.version,
    });
  } catch (error) {
    console.error('Error getting sync data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Push sync data to server
 */
export async function pushData(req, res) {
  try {
    const { secretKey } = req;
    const { data: clientData, clientVersion } = req.body;

    if (!clientData) {
      return res.status(400).json({ error: 'No data provided' });
    }

    const collection = getCollection();
    const serverData = await collection.findOne({ secretKey });

    // If no server data exists, this is the first sync
    if (!serverData) {
      const newDoc = {
        secretKey,
        content: clientData,
        lastSync: new Date().toISOString(),
        version: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      await collection.insertOne(newDoc);

      console.log(`✅ Initial sync - Version: 1`);
      return res.json({
        success: true,
        version: 1,
        lastSync: newDoc.lastSync,
        message: 'Initial sync completed',
      });
    }

    // Simple conflict resolution: last write wins
    // Increment version number for this push
    const newVersion = serverData.version + 1;
    const updateData = {
      content: clientData,
      lastSync: new Date().toISOString(),
      version: newVersion,
      updatedAt: new Date(),
    };

    await collection.updateOne(
      { secretKey },
      { $set: updateData }
    );

    console.log(`✅ Push completed - Client v${clientVersion} → Server v${newVersion}`);
    res.json({
      success: true,
      version: newVersion,
      lastSync: updateData.lastSync,
      message: 'Sync completed',
    });
  } catch (error) {
    console.error('Error pushing sync data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Pull sync data with conflict detection
 */
export async function pullData(req, res) {
  try {
    const { secretKey } = req;
    const { clientVersion, clientLastSync } = req.body; // clientLastSync for backward compatibility

    const collection = getCollection();
    const serverData = await collection.findOne({ secretKey });

    if (!serverData) {
      console.log(`📥 Pull - No data on server for this key`);
      return res.json({
        exists: false,
        message: 'No data on server',
      });
    }

    // Check if client is up to date
    const hasConflict = clientVersion && clientVersion < serverData.version;
    
    console.log(`📥 Pull - Client v${clientVersion} ← Server v${serverData.version} ${hasConflict ? '(conflict)' : '(up to date)'}`);
    res.json({
      exists: true,
      data: serverData.content,
      version: serverData.version,
      lastSync: serverData.lastSync,
      hasConflict,
      message: hasConflict ? 'Conflict detected' : 'Data up to date',
    });
  } catch (error) {
    console.error('Error pulling sync data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Delete sync data (for testing or account cleanup)
 */
export async function deleteData(req, res) {
  try {
    const { secretKey } = req;
    const collection = getCollection();
    await collection.deleteOne({ secretKey });

    res.json({ success: true, message: 'Data deleted' });
  } catch (error) {
    console.error('Error deleting sync data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
