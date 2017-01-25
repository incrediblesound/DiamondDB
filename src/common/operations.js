/*
 * Initializes the persistence layer: this should return the object containing metadata
 * for all tables.
 */
const INITIALIZE_PERSISTANCE = 'INITIALIZE_PERSISTANCE'
const initialize = () => {
  return {
    operation: INITIALIZE_PERSISTANCE
  }
}
/*
 * This is the corrolary to the above message, it tells the persistence layer to save
 * the metadata about a given table to disk
 */
const UPDATE_META = 'UPDATE_META'
const updateMeta = (tables) => {
  return {
    operation: UPDATE_META,
    data: {
      tables
    }
  }
}

const MAKE_TABLE = 'MAKE_TABLE'
const makeTable = (tableData) => {
  return {
    operation: MAKE_TABLE,
    data: {
      tableData
    }
  }
}

const STORE_RECORD = 'STORE_RECORD'
const storeRecord = (table, record, id) => {
  return {
    operation: STORE_RECORD,
    data: {
      table,
      record,
      id
    }
  }
}

const FETCH_RECORD = 'FETCH_RECORD'
const fetchRecord = (table, id) => {
  return {
    operation: FETCH_RECORD,
    data: {
      table,
      id
    }
  }
}

const PERSIST_ALL = 'PERSIST_ALL'
const writeToDisk = () => {
  return {
    operation: PERSIST_ALL
  }
}

const SUCCESS = 'SUCCESS'
const success = (data) => {
  return {
    operation: SUCCESS,
    data
  }
}

const FAILURE = 'FAILURE'
const failure = (data) => {
  return {
    operation: FAILURE,
    data
  }
}

module.exports = {
  FAILURE,
  failure,
  SUCCESS,
  success,
  PERSIST_ALL,
  writeToDisk,
  FETCH_RECORD,
  fetchRecord,
  STORE_RECORD,
  storeRecord,
  MAKE_TABLE,
  makeTable,
  INITIALIZE_PERSISTANCE,
  initialize,
  UPDATE_META,
  updateMeta
}
