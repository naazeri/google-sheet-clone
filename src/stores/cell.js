import { defineStore } from 'pinia'

const MAX_TOTAL_CELLS = 11000

export const useCellsStore = defineStore('cells', {
  state: () => ({
    columnCount: 26,
    rowCount: 50,
    cellsData: {},
    selectedCellId: '',
    currentCellRawValue: '',
    isTypingFormula: false
  }),

  actions: {
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
    },

    updateIsTypingFormula(isTypingFormula) {
      this.isTypingFormula = isTypingFormula
    },

    updateSelectedCellId(newCellId) {
      this.selectedCellId = newCellId

      if (this.cellsData[newCellId]) {
        this.currentCellRawValue = this.cellsData[newCellId].rawValue
      } else {
        this.currentCellRawValue = ''
      }
    },

    addColumns(count) {
      if (count < 1) {
        return
      }

      const totalCells = (this.columnCount + count) * this.rowCount
      if (totalCells < MAX_TOTAL_CELLS) {
        this.columnCount += count
      }
    }
  },

  getters: {
    getCellData() {
      return (cellId) => {
        return (
          this.cellsData[cellId] || {
            rawValue: '',
            evaluatedValue: ''
          }
        )
      }
    },
    getSelectedCellRawValue: (state) => {
      const value = state.cellsData[state.selectedCellId]
      return value ? value.rawValue : ''
    }
  }
})
