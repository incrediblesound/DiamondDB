/*
 * Initializes the persistence layer: this should return the object containing metadata
 * for all tables.
 */
 export const INITIALIZE_PERSISTANCE = 'INITIALIZE_PERSISTANCE'
export const initialize = () => {
  return {
    operation: INITIALIZE_PERSISTANCE
  }
}
/*
 * This is the corrolary to the above message, it tells the persistence layer to save
 * the metadata about a given table to disk
 */
export const UPDATE_META = 'UPDATE_META'
export const updateMeta = (tables) => {
  return {
    operation: UPDATE_META,
    data: {
      tables
    }
  }
}

export const MAKE_TABLE = 'MAKE_TABLE'
export const makeTable = (tableData) => {
  return {
    operation: MAKE_TABLE,
    data: {
      tableData
    }
  }
}

export const STORE_RECORD = 'STORE_RECORD'
export const storeRecord = (table, record, id) => {
  return {
    operation: STORE_RECORD,
    data: {
      table,
      record,
      id
    }
  }
}

export const FETCH_RECORD = 'FETCH_RECORD'
export const fetchRecord = (tableName, id) => {
  return {
    operation: FETCH_RECORD,
    data: {
      tableName,
      id
    }
  }
}

export const PERSIST_ALL = 'PERSIST_ALL'
export const writeToDisk = () => {
  return {
    operation: PERSIST_ALL
  }
}

export const SUCCESS = 'SUCCESS'
export const success = (data) => {
  return {
    operation: SUCCESS,
    data
  }
}

export const FAILURE = 'FAILURE'
export const failure = (data) => {
  return {
    operation: FAILURE,
    data
  }
}
