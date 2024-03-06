<template>
  <input
    v-if="isEditMode"
    @keyup.enter="onEnterPressed"
    class="cellInput"
    type="text"
    :value="rawValue"
    @input="onInput"
    v-on-click-outside="onCellOutsideClick"
  />
  <div v-else @click="onCellClick" class="cellLabel">
    {{ getEvaluatedValue }}
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { vOnClickOutside } from '@vueuse/components'
import { useCellsStore } from '@/stores/counter'
import { extractDigits, extractLetters, increaseAlphabet } from '@/utils'

const props = defineProps(['cellId'])
// console.log('🚀 ~ props:', props.cellId)

const cellsStore = useCellsStore()

const isEditMode = ref(false)
let rawValue = ''

const getEvaluatedValue = computed(() => {
  if (props.cellId in cellsStore.cellsData2) {
    return cellsStore.cellsData[props.cellId].evaluatedValue
  }
  return ''
})

const onCellClick = () => {
  isEditMode.value = true
  cellsStore.selectedCellId = props.cellId
}

const onCellOutsideClick = () => {
  isEditMode.value = false
  onEditingFinished()
}

const onEnterPressed = () => {
  isEditMode.value = false
  onEditingFinished()
}

const onInput = (event) => {
  rawValue = event.target.value

  if (rawValue.includes('\t') || rawValue.includes('\n')) {
    const rowValues = rawValue.split(' ')
    let lastColumnName = extractLetters(props.cellId)
    const columnNames = []
    const data = {}

    rowValues.forEach((rowValue, rowIndex) => {
      const columnValues = rowValue.split('\t')
      console.log('🚀 ~ onInput ~ columnValues:', columnValues)

      columnValues.forEach((columnValue, colIndex) => {
        // store column letter names just once
        if (rowIndex === 0) {
          let columnName
          if (columnNames.length !== 0) {
            columnName = increaseAlphabet(lastColumnName)
          }
          const rowName = parseInt(extractDigits(props.cellId))
          columnNames.push(`${columnName}${rowName + rowIndex}`)
        }

        data[columnNames[colIndex]] = columnValue
      })
    })

    console.log('🚀 ~ onInput ~ columnLetterNames:', columnNames)
    console.log(data)
  } else {
    console.log(rawValue)
  }
}

const onEditingFinished = () => {
  let evaluatedResult = ''

  if (rawValue.startsWith('=')) {
    let formula = rawValue.toUpperCase().substring(1)
    const cellIds = getCellIds(formula)

    for (const cellId of cellIds) {
      const cellValue = cellsStore.getCellData(cellId).evaluatedValue
      formula = formula.replace(cellId, cellValue)
      // formula += operators[index] ? `${cellValue}${operators[index]}` : `${cellValue}`
    }

    // cellIds.forEach((cellId, index) => {
    //   const cellValue = cellsStore.getCellData(cellId).evaluatedValue
    //   formula += operators[index] ? `${cellValue}${operators[index]}` : `${cellValue}`
    // })

    console.log('🚀 ~ onEditingFinished ~ formula:', formula)
    evaluatedResult = eval(formula)
  } else {
    evaluatedResult = rawValue
  }

  cellsStore.updateCellData(props.cellId, rawValue, evaluatedResult)

  console.log({ id: props.cellId, rawValue, evaluatedResult })
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

function getCellIds(formula) {
  const cellPattern = /[A-Z]+\d+/g
  const matches = formula.match(cellPattern)

  if (matches) {
    return matches
  } else {
    return []
  }
}
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
