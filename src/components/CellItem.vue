<template>
  <div
    contenteditable
    ref="contentEditable"
    @input="handleInput"
    @focusin="handleFocusIn"
    @focusout="onEditingFinished"
    @keydown.enter.prevent="onEnterPressed"
    class="cellLabel"
  />
</template>

<script setup>
import { computed, ref, watch } from 'vue'
// import { vOnClickOutside } from '@vueuse/components'
import { useCellsStore } from '@/stores/cell'
import {
  extractCellIds,
  extractDigits,
  extractLetters,
  increaseAlphabet,
  lettersToNumber
} from '@/utils'

const props = defineProps(['cellId'])
const cellsStore = useCellsStore()
const isEditMode = ref(false)
const contentEditable = ref()
// let rawValue = ''

const getCellData = computed(() => {
  if (isEditMode.value) {
    return cellsStore.getCellData(props.cellId).rawValue
  }

  return cellsStore.getCellData(props.cellId).evaluatedValue
})

watch(getCellData, (newValue) => {
  contentEditable.value.innerText = newValue
})

cellsStore.$onAction(
  ({
    name, // name of the action
    store, // store instance
    args, // array of parameters passed to the actio
    after // hook after the action returns or resolves
  }) => {
    if (store.$id === 'cells' && name === 'updateCellData' && args[0] !== props.cellId) {
      // get self rawValue
      const rawValue = cellsStore.getCellData(props.cellId).rawValue

      if (rawValue.startsWith('=')) {
        // cell have formula
        after(() => {
          const cellIds = extractCellIds(rawValue)
          cellIds.forEach((cellId) => {
            if (cellId === args[0]) {
              // updated cell data used in formula. so formula need update
              const result = calculateFormula(rawValue)
              cellsStore.updateCellData(props.cellId, result.rawResult, result.evaluatedResult)
            }
          })
        })
      }
    }
  }
)

const onEnterPressed = () => {
  // isEditMode.value = false
  onEditingFinished()
  contentEditable.value.blur()
}

const handleInput = () => {
  cellsStore.currentCellRawValue = contentEditable.value.innerText

  // equivalent to: rawValue.includes('\t') || rawValue.includes('\n')
  if (/[\t\n]/.test(cellsStore.currentCellRawValue)) {
    // pasted data from Sheets

    // replace with regex for search one time
    const rowValues = cellsStore.currentCellRawValue.split('\n')
    const columnNames = []
    const data = {}
    let lastColumnName = extractLetters(props.cellId)
    const rowNumber = parseInt(extractDigits(props.cellId))

    rowValues.forEach((rowValue, rowIndex) => {
      const columnValues = rowValue.split('\t')

      columnValues.forEach((columnValue, columnIndex) => {
        // store column letter names just once
        if (rowIndex === 0) {
          if (columnNames.length !== 0) {
            lastColumnName = increaseAlphabet(lastColumnName)
          }
          columnNames.push(lastColumnName)

          if (columnIndex === 0) {
            cellsStore.currentCellRawValue = columnValue
          }
        }

        data[`${columnNames[columnIndex]}${rowNumber + rowIndex}`] = {
          rawValue: columnValue,
          evaluatedValue: columnValue
        }
      })
    })

    cellsStore.updateCellsData(data)
  }
}

const handleFocusIn = () => {
  isEditMode.value = true
  cellsStore.updateSelectedCellId(props.cellId)
}

const onEditingFinished = () => {
  isEditMode.value = false
  let result = {
    rawResult: undefined,
    evaluatedResult: undefined
  }
  const currentCellRawValue = cellsStore.currentCellRawValue
  // console.log(`${props.cellId}: ${currentCellRawValue}`)

  if (currentCellRawValue.startsWith('=')) {
    result = calculateFormula(currentCellRawValue.toUpperCase())
  } else {
    result.rawResult = currentCellRawValue
    result.evaluatedResult = currentCellRawValue
  }

  cellsStore.updateCellData(props.cellId, result.rawResult, result.evaluatedResult)
  checkNeedResize()
}

const calculateFormula = (formula) => {
  let rawResult = ''
  let evaluatedResult = ''

  try {
    rawResult = formula
    formula = rawResult.substring(1)
    const cellIds = extractCellIds(formula)

    for (const cellId of cellIds) {
      const cellValue = cellsStore.getCellData(cellId).evaluatedValue

      if (!cellValue) {
        throw new Error("Cell doesn't exist")
      }

      formula = formula.replace(cellId, cellValue)
    }

    // cellIds.forEach((cellId, index) => {
    //   const cellValue = cellsStore.getCellData(cellId).evaluatedValue
    //   formula += operators[index] ? `${cellValue}${operators[index]}` : `${cellValue}`
    // })

    // console.log('🚀 ~ onEditingFinished ~ formula:', formula)
    evaluatedResult = eval(formula)
  } catch (error) {
    evaluatedResult = 'INVALID'
  }

  return { rawResult, evaluatedResult }
}

function checkNeedResize() {
  const columnName = extractLetters(props.cellId)
  const columnNumber = lettersToNumber(columnName)
  const rowNumber = parseInt(extractDigits(props.cellId))
  let expandedColumnCount = false
  let expandedRowCount = false

  if (columnNumber + 10 > cellsStore.columnCount) {
    expandedColumnCount = true
  }

  if (rowNumber + 10 > cellsStore.rowCount) {
    expandedRowCount = true
  }

  cellsStore.addCellsCount(expandedColumnCount ? 10 : 0, expandedRowCount ? 10 : 0)
}

// const evaluate = (value, operation) => {
//   for (let i = 1; i < value.length; i++) {
//     const char = value[i]
//     console.log('🚀 ~ evaluate ~ char:', char)
//   }
//   const cellsName = value.substring(1, value.length)
//   const cellsId = cellsName.split(',')
//   let result

//   cellsId.forEach((cell_id, index) => {
//     if (index !== 0) {
//       const value = cellsStore.getCellData(cell_id)
//     } else {
//       // first item
//       result = cellsStore.getCellData(cell_id)
//     }
//   })

//   return result
// }
</script>

<style>
.cellInput {
  width: 100%;
  height: 100%;
  font-size: 16px;
  padding: 0;
  margin: 0;
  border: 0;
  font-family: tahoma;
}

.cellLabel {
  overflow: auto;
  width: 100%;
  height: 100%;
  line-height: 19px;
  padding: 2px;
  text-overflow: clip;
  white-space: nowrap;
}
</style>
