import { defineStore } from 'pinia'

export const useCellsStore = defineStore('cells', {
  state: () => ({
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
