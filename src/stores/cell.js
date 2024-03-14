import { defineStore } from 'pinia'

const MAX_TOTAL_CELLS = 11000

export const useCellsStore = defineStore('cells', {
  state: () => ({
    columnCount: 100,
    rowCount: 80,
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

    addCellsCount(addColumnCount, addRowCount) {
      if (addColumnCount < 0 || addRowCount < 0) {
        return false
      }

      const totalCells = (this.columnCount + addColumnCount) * (this.rowCount + addRowCount)
      if (totalCells < MAX_TOTAL_CELLS) {
        this.columnCount += addColumnCount
        this.rowCount += addRowCount
      } else {
        alert('به حداکثر میزان تعداد سلول رسیدید. بیش از این امکان ایجاد سلول جدید وجود ندارد 🥲')
        return false
      }

      return true
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
