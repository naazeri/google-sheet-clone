<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <v-card>
      <v-card-title>
        <span class="text-h5">{{ isEditMode ? 'Edit' : 'Add' }} Item</span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid">
          <v-text-field
            v-model="itemData.name"
            :rules="[rules.required]"
            label="Item Name"
            required
          ></v-text-field>
          <v-text-field
            v-model="itemData.chance"
            :rules="[rules.required, rules.number]"
            label="Chance"
            type="number"
            required
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
        <v-btn color="blue darken-1" text @click="save" :disabled="!valid">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { ref, reactive, watch } from 'vue'

export default {
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object,
      default: () => ({ name: '', chance: 0 })
    },
    editMode: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'save', 'close'],
  setup(props, { emit }) {
    const dialog = ref(props.modelValue)
    const valid = ref(false)
    const itemData = reactive({ ...props.item })
    const isEditMode = ref(props.editMode)

    const rules = {
      required: (value) => !!value || 'Required.',
      number: (value) =>
        (!isNaN(value) && value >= 0) || 'Must be a number greater than or equal to 0.'
    }

    watch(
      () => props.modelValue,
      (newVal) => {
        dialog.value = newVal
      }
    )

    watch(dialog, (newVal) => {
      emit('update:modelValue', newVal)
      if (!newVal) {
        // Reset form when dialog closes
        itemData.name = ''
        itemData.chance = 0
        isEditMode.value = false
        valid.value = false
      }
    })

    watch(
      () => props.item,
      (newVal) => {
        itemData.name = newVal.name
        itemData.chance = newVal.chance
      }
    )

    watch(
      () => props.editMode,
      (newVal) => {
        isEditMode.value = newVal
      }
    )

    const save = () => {
      emit('save', { ...itemData })
    }

    const close = () => {
      emit('close')
    }

    return {
      dialog,
      itemData,
      valid,
      rules,
      isEditMode,
      save,
      close
    }
  }
}
</script>
