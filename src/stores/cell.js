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
    getSelectedCellData() {
      const value = this.cellsData[this.selectedCellId]
      return value ? value.rawValue : ''
    },
    updateCellData(cellId, rawValue, evaluatedValue) {
      this.cellsData = {
        ...this.cellsData,
        [cellId]: {
          rawValue: rawValue,
          evaluatedValue: evaluatedValue
        }
      }
    },
    updateCellsData(cellsData) {
      this.cellsData = {
        ...this.cellsData,
        ...cellsData
      }
    }
  },

  getters: {
    getCellsData: (state) => state.cellsData
  }
})
