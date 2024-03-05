import { defineStore } from 'pinia'

export const useCellsStore = defineStore('cells', {
  state: () => ({
    cellsData: {},
    selectedCellId: ''
  }),

  actions: {
    getCellData(cellId) {
      return this.cellsData[cellId]
    },
    updateCellData(cellId, rawValue, evaluatedValue) {
      this.cellsData = {
        ...this.cellsData,
        [cellId]: {
          rawValue: rawValue,
          evaluatedValue: evaluatedValue
        }
      }
    }
  },

  getters: {
    cellsData2: (state) => state.cellsData
  }
})
