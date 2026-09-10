const { Setting } = require('./db');

setTimeout(async () => {
  try {
    const userDoc = await Setting.findOne({ key: 'admin_username' });
    const passDoc = await Setting.findOne({ key: 'admin_password' });
    console.log('DB admin_username:', userDoc);
    console.log('DB admin_password:', passDoc);

    // Force update to make 100% sure username='admin' and password='admin215'
    await Setting.findOneAndUpdate({ key: 'admin_username' }, { key: 'admin_username', value: 'admin' }, { upsert: true, new: true });
    await Setting.findOneAndUpdate({ key: 'admin_password' }, { key: 'admin_password', value: 'admin215' }, { upsert: true, new: true });
    console.log('Force updated admin credentials in MongoDBAtlas!');

    const userDoc2 = await Setting.findOne({ key: 'admin_username' });
    const passDoc2 = await Setting.findOne({ key: 'admin_password' });
    console.log('Updated DB admin_username:', userDoc2);
    console.log('Updated DB admin_password:', passDoc2);

  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}, 2500);
