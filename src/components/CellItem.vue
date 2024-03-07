<template>
  <!-- <input
    v-if="isEditMode"
    @keyup.enter="onEnterPressed"
    class="cellInput"
    type="text"
    :value="rawValue"
    @input="onInput"
    v-on-click-outside="onCellOutsideClick"
  /> -->
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
import { extractDigits, extractLetters, increaseAlphabet } from '@/utils'

const props = defineProps(['cellId'])
const cellsStore = useCellsStore()
// const isEditMode = ref(false)
const contentEditable = ref()
let rawValue = ''

const getEvaluatedValue = computed(() => {
  if (props.cellId in cellsStore.getCellsData) {
    return cellsStore.cellsData[props.cellId].evaluatedValue
  }
  return ''
})

watch(getEvaluatedValue, () => {
  contentEditable.value.innerText = getEvaluatedValue.value
})

const handleFocusIn = () => {
  // isEditMode.value = true
  cellsStore.selectedCellId = props.cellId
}

// const onCellOutsideClick = () => {
//   isEditMode.value = false
// onEditingFinished()
// }

const onEnterPressed = () => {
  // isEditMode.value = false
  onEditingFinished()
  contentEditable.value.blur()
}

const handleInput = () => {
  rawValue = contentEditable.value.innerText
  // console.log(`${props.cellId}: ${rawValue}`)
  // rawValue = event.target.value

  // equivalent to: rawValue.includes('\t') || rawValue.includes('\n')
  if (/[\t\n]/.test(rawValue)) {
    // replace with regex for search one time
    const rowValues = rawValue.split('\n')
    const columnNames = []
    const data = {}
    let lastColumnName = extractLetters(props.cellId)
    const rowNumber = parseInt(extractDigits(props.cellId))

    rowValues.forEach((rowValue, rowIndex) => {
      const columnValues = rowValue.split('\t')
      // console.log('🚀 ~ onInput ~ columnValues:', columnValues)

      columnValues.forEach((columnValue, columnIndex) => {
        // store column letter names just once
        if (rowIndex === 0) {
          if (columnNames.length !== 0) {
            lastColumnName = increaseAlphabet(lastColumnName)
          }
          columnNames.push(lastColumnName)

          if (columnIndex === 0) {
            rawValue = columnValue
          }
        }

        data[`${columnNames[columnIndex]}${rowNumber + rowIndex}`] = {
          rawValue: columnValue,
          evaluatedValue: columnValue
        }
      })
    })

    cellsStore.updateCellsData(data)
    // console.log(data)
  }
}

const onEditingFinished = () => {
  // isEditMode.value = false
  let evaluatedResult = ''

  if (rawValue.startsWith('=')) {
    let formula = rawValue.toUpperCase().substring(1)
    const cellIds = getCellIds(formula)

    for (const cellId of cellIds) {
      const cellValue = cellsStore.getCellData(cellId).evaluatedValue
      formula = formula.replace(cellId, cellValue)
    }

    // cellIds.forEach((cellId, index) => {
    //   const cellValue = cellsStore.getCellData(cellId).evaluatedValue
    //   formula += operators[index] ? `${cellValue}${operators[index]}` : `${cellValue}`
    // })

    // console.log('🚀 ~ onEditingFinished ~ formula:', formula)
    evaluatedResult = eval(formula)
  } else {
    evaluatedResult = rawValue
  }

  cellsStore.updateCellData(props.cellId, rawValue, evaluatedResult)
  // console.log({ id: props.cellId, rawValue, evaluatedResult })
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
@/stores/cells
