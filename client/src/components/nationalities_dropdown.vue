<template>
  <el-select v-model="selectedNationality" size="large" filterable default-first-option @change="emitSelectedNationality"
    style="width: 100%">
    <el-option style="color: brown" value="Unknown"><el-icon>
        <QuestionFilled />
      </el-icon>
      &nbsp; Unknown
    </el-option>
    <el-option v-for="nationality in nationalities" :key="nationality" :label="nationality"
      :value="nationality"></el-option>
  </el-select>
</template>

<script setup>
import { ref, onMounted, defineProps, watch } from 'vue'
import axios from 'axios'

const emit = defineEmits(['selectedNationality'])
const props = defineProps(['nationality'])

const nationalities = ref([])
const selectedNationality = ref(null)

const fetchNationalities = async () => {
  try {
    const response = await axios.get('https://restcountries.com/v2/all')
    nationalities.value = response.data.map((country) => country.name)

    // Set the selectedNationality based on the prop if it is provided
    if (props.nationality) {
      selectedNationality.value = props.nationality
    }
  } catch (error) {
    console.error('Error fetching nationalities: ', error)
  }
}

const emitSelectedNationality = () => {
  if (selectedNationality.value) {
    emit('selectedNationality', selectedNationality.value)
  }
}

watch(() => props.nationality, (newValue) => {
  selectedNationality.value = newValue
})

onMounted(() => {
  fetchNationalities()
})
</script>
