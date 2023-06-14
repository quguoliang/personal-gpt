// interface IAddData {
//   time: string;
//   voice: Blob;
// }

// /**  */
// class OperateIndexDB {
//   private DB!: IDBDatabase;
//   private onupgradeneeded:
//     | ((this: IDBOpenDBRequest, ev: IDBVersionChangeEvent) => any)
//     | null;

//   constructor(dbName: string) {
//     const request = window.indexedDB.open(dbName);
//     this.onupgradeneeded = request.onupgradeneeded;
//     request.onsuccess = () => {
//       this.DB = request.result;
//     };
//   }

//   /** 新增表记录 */
//   add = (tableName: string, data: IAddData) => {
//     if (!this.DB.objectStoreNames.contains(tableName)) {
//       this.onupgradeneeded = () => {
//         this.DB.createObjectStore(tableName, { keyPath: 'time' });
//       };
//     }
//     this.onupgradeneeded = () => {
//       console.log(tableName, data);

//       this.DB.transaction([tableName], 'readwrite')
//         .objectStore(tableName)
//         .add(data);
//     };
//   };

//   /** 读取表的某条记录 */
//   read = (tableName: string, key: string) => {
//     const request = this.DB.transaction([tableName])
//       .objectStore(tableName)
//       .get(key);
//     request.onerror = function (event) {
//       console.log('获取indexDb数据失败');
//     };
//     return request.result;
//   };

//   /** 更新表的某条记录 */
//   update = (tableName: string, data: IAddData) => {
//     this.DB.transaction([tableName], 'readwrite')
//       .objectStore(tableName)
//       .put(data);
//   };

//   /** 删除表的某条记录 */
//   delete = (tableName: string, key: string) => {
//     this.DB.transaction([tableName], 'readwrite')
//       .objectStore(tableName)
//       .delete(key);
//   };

//   /** 删除表 */
//   deleteDbTable = (tableName: string) => {
//     this.DB.transaction([tableName], 'readwrite')
//       .objectStore(tableName)
//       .clear();
//   };
// }

// export default OperateIndexDB;

// 定义数据类型
class OperateIndexDB {
  private dbName: string;
  private dbVersion: number;
  private db!: IDBDatabase;

  constructor(dbName: string, dbVersion: number) {
    this.dbName = dbName;
    this.dbVersion = dbVersion;
    this.initDB();
  }

  private initDB() {
    const request = window.indexedDB.open(this.dbName, this.dbVersion);

    request.onerror = (event: any) => {
      console.error('Failed to open database:', event.target.error);
    };

    request.onsuccess = (event: any) => {
      this.db = event.target.result;
      console.log('Database opened successfully');
    };

    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains('voices')) {
        const objectStore = db.createObjectStore('voices', { keyPath: 'time' });
        console.log('voices table created successfully');
      }
    };
  }

  addVoice(time: string, voice: Blob): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['voices'], 'readwrite');
      const objectStore = transaction.objectStore('voices');
      const request = objectStore.add({ time, voice });

      request.onerror = (event: any) => {
        console.error('Failed to add voice:', event.target.error);
        reject(event.target.error);
      };

      request.onsuccess = () => {
        console.log('Voice added successfully');
        resolve();
      };
    });
  }

  getVoice(time: string): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['voices'], 'readonly');
      const objectStore = transaction.objectStore('voices');
      const request = objectStore.get(time);

      request.onerror = (event: any) => {
        console.error('Failed to get voice:', event.target.error);
        reject(event.target.error);
      };

      request.onsuccess = (event: any) => {
        const voice = event.target.result?.voice;
        if (voice) {
          console.log('Voice retrieved successfully');
          resolve(voice);
        } else {
          console.error(`Voice with time ${time} not found`);
          reject(`Voice with time ${time} not found`);
        }
      };
    });
  }

  updateVoice(time: string, voice: Blob): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['voices'], 'readwrite');
      const objectStore = transaction.objectStore('voices');
      const request = objectStore.put({ time, voice });

      request.onerror = (event: any) => {
        console.error('Failed to update voice:', event.target.error);
        reject(event.target.error);
      };

      request.onsuccess = () => {
        console.log('Voice updated successfully');
        resolve();
      };
    });
  }

  deleteVoice(time: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['voices'], 'readwrite');
      const objectStore = transaction.objectStore('voices');
      const request = objectStore.delete(time);

      request.onerror = (event: any) => {
        console.error('Failed to delete voice:', event.target.error);
        reject(event.target.error);
      };

      request.onsuccess = () => {
        console.log('Voice deleted successfully');
        resolve();
      };
    });
  }

  deleteTable(): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['voices'], 'readwrite');
      const objectStore = transaction.objectStore('voices');
      const request = objectStore.clear();

      request.onerror = (event: any) => {
        console.error('Failed to clear table:', event.target.error);
        reject(event.target.error);
      };

      request.onsuccess = () => {
        console.log('Table cleared successfully');
        resolve();
      };
    });
  }
}

export default OperateIndexDB;
