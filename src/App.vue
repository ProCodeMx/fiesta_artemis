<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { supabase } from './supabase'

// Definición de tipos
interface RsvpData {
  nombre_invitado: string
  asistira: boolean
  cantidad_personas: number
  mensaje_especial?: string
}

// Estados reactivos
const nombre = ref<string>('')
const asistira = ref<string>('si')
const personas = ref<number>(1)
const mensaje = ref<string>('')
const enviado = ref<boolean>(false)
const cargando = ref<boolean>(false)
const errorMsg = ref<string>('')

// Configuración del Contador Regresivo (Septiembre 13 del año actual o próximo)
const fechaEvento = new Date(new Date().getFullYear(), 8, 13, 14, 0, 0) // Mes 8 = Septiembre
const dias = ref<number>(0)
const horas = ref<number>(0)
const minutos = ref<number>(0)
const segundos = ref<number>(0)
let timer: any = null

const actualizarContador = () => {
  const ahora = new Date().getTime()
  const diferencia = fechaEvento.getTime() - ahora

  if (diferencia > 0) {
    dias.value = Math.floor(diferencia / (1000 * 60 * 60 * 24))
    horas.value = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    minutos.value = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60))
    segundos.value = Math.floor((diferencia % (1000 * 60)) / 1000)
  }
}

onMounted(() => {
  actualizarContador()
  timer = setInterval(actualizarContador, 1000)
})

onUnmounted(() => {
  clearInterval(timer)
})

// Función para enviar los datos a PostgreSQL
const enviarRSVP = async () => {
  cargando.value = true
  errorMsg.value = ''

  const nuevoRegistro: RsvpData = {
    nombre_invitado: nombre.value,
    asistira: asistira.value === 'si',
    cantidad_personas: asistira.value === 'si' ? personas.value : 0,
    mensaje_especial: mensaje.value
  }

  try {
    const { error } = await supabase
      .from('rsvp_invitacion')
      .insert([nuevoRegistro])

    if (error) throw error
    enviado.value = true
  } catch (error: any) {
    console.error('Error al guardar en PostgreSQL:', error.message)
    errorMsg.value = 'Hubo un error al enviar tu confirmación. Inténtalo de nuevo.'
  } finally {
    cargando.value = false
  }
}
</script>

<template>
  <main
    class="min-h-screen bg-gradient-to-b from-slate-950 via-sky-900 to-blue-950 text-white flex flex-col items-center justify-center p-4 selection:bg-sky-500 selection:text-white">

    <!-- Tarjeta Principal Estilo Invitación -->
    <div
      class="max-w-md w-full bg-sky-950/40 backdrop-blur-xl border border-sky-300/30 rounded-3xl shadow-2xl overflow-hidden p-6 text-center relative shadow-sky-500/10">

      <!-- Decoración tipo Elsa / Copos de nieve flotantes -->
      <div class="absolute top-4 left-4 text-sky-200 text-xl animate-pulse">❄️</div>
      <div class="absolute top-4 right-4 text-sky-200 text-xl animate-pulse">❄️</div>

      <h3 class="text-sky-300 uppercase tracking-widest text-xs font-semibold mb-1">El reino de hielo te invita</h3>
      <h1
        class="text-4xl font-extrabold font-serif text-transparent bg-clip-text bg-gradient-to-r from-sky-200 via-white to-sky-400 mb-4">
        Artemis Verduzco
      </h1>

      <!-- Imagen temática de Elsa / Invierno -->
      <div class="my-4 rounded-2xl overflow-hidden shadow-xl border border-sky-400/30 relative group">
        <img
          src="https://ep01.epimg.net/verne/imagenes/2019/11/21/articulo/1574343498_750089_1574354089_noticia_normal.jpg"
          alt="Frozen Theme"
          class="w-full h-48 object-cover opacity-90 group-hover:scale-105 transition duration-700" />
        <div class="absolute inset-0 bg-gradient-to-t from-sky-950/60 via-transparent to-transparent"></div>
      </div>

      <!-- Detalles del Evento -->
      <div
        class="space-y-2 text-lg text-sky-100 mb-6 bg-sky-900/30 p-4 rounded-2xl border border-sky-500/20 shadow-inner">
        <p class="flex items-center justify-center gap-2">📅 <strong>Fecha:</strong> Septiembre 13 a las 14:00 hrs</p>
        <p class="flex items-center justify-center gap-2">🏰 <strong>Lugar:</strong> Jardín La Esperanza</p>
      </div>

      <!-- Contador Regresivo -->
      <div class="mb-6">
        <p class="text-xs text-sky-300 uppercase tracking-wider mb-2 font-medium">Faltan para la gran fiesta:</p>
        <div class="grid grid-cols-4 gap-2 text-center">
          <div class="bg-sky-900/50 border border-sky-400/20 rounded-xl p-2">
            <span class="block text-xl font-bold text-white">{{ dias }}</span>
            <span class="text-[10px] text-sky-300 uppercase">Días</span>
          </div>
          <div class="bg-sky-900/50 border border-sky-400/20 rounded-xl p-2">
            <span class="block text-xl font-bold text-white">{{ horas }}</span>
            <span class="text-[10px] text-sky-300 uppercase">Horas</span>
          </div>
          <div class="bg-sky-900/50 border border-sky-400/20 rounded-xl p-2">
            <span class="block text-xl font-bold text-white">{{ minutos }}</span>
            <span class="text-[10px] text-sky-300 uppercase">Min</span>
          </div>
          <div class="bg-sky-900/50 border border-sky-400/20 rounded-xl p-2">
            <span class="block text-xl font-bold text-white">{{ segundos }}</span>
            <span class="text-[10px] text-sky-300 uppercase">Seg</span>
          </div>
        </div>
      </div>

      <!-- Botón de Ubicación actualizados -->
      <a href="https://share.google/TiLEjbmkuzEIJg97E" target="_blank"
        class="block w-full py-3 px-4 bg-gradient-to-r from-sky-400 to-blue-600 hover:from-sky-300 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-sky-500/20 transition duration-200 mb-6 text-center text-sm tracking-wide">
        🗺️ Ver Ubicación en el Mapa
      </a>

      <hr class="border-sky-800/40 my-6">

      <!-- Sección de Confirmación (RSVP) -->
      <div v-if="!enviado">
        <h2 class="text-lg font-semibold mb-4 text-sky-200">¿Nos acompañarás en este día mágico?</h2>

        <form @submit.prevent="enviarRSVP" class="space-y-4 text-left">
          <div>
            <label class="block text-xs font-medium text-sky-300 mb-1">Tu Nombre Completo / Familia</label>
            <input v-model="nombre" required type="text" placeholder="Ej. Familia Pérez"
              class="w-full px-3 py-2 bg-sky-950/60 border border-sky-500/30 rounded-xl text-white placeholder-sky-400/40 focus:outline-none focus:border-sky-300 transition text-sm" />
          </div>

          <div class="flex gap-4">
            <div class="flex-1">
              <label class="block text-xs font-medium text-sky-300 mb-1">¿Asistirás?</label>
              <select v-model="asistira"
                class="w-full px-3 py-2 bg-sky-950/60 border border-sky-500/30 rounded-xl text-white focus:outline-none focus:border-sky-300 transition text-sm">
                <option value="si">¡Sí, ahí estaré!</option>
                <option value="no">No podré asistir</option>
              </select>
            </div>

            <div class="w-24" v-if="asistira === 'si'">
              <label class="block text-xs font-medium text-sky-300 mb-1">Lugares</label>
              <input v-model.number="personas" type="number" min="1" max="10"
                class="w-full px-3 py-2 bg-sky-950/60 border border-sky-500/30 rounded-xl text-white focus:outline-none focus:border-sky-300 transition text-sm text-center" />
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-sky-300 mb-1">Mensaje para Artemis (Opcional)</label>
            <textarea v-model="mensaje" rows="2" placeholder="Escribe un lindo deseo..."
              class="w-full px-3 py-2 bg-sky-950/60 border border-sky-500/30 rounded-xl text-white placeholder-sky-400/40 focus:outline-none focus:border-sky-300 transition resize-none text-sm"></textarea>
          </div>

          <p v-if="errorMsg" class="text-red-400 text-xs text-center">{{ errorMsg }}</p>

          <button :disabled="cargando" type="submit"
            class="w-full py-3 bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white font-bold rounded-xl shadow-lg transition duration-200 disabled:opacity-50 cursor-pointer text-sm">
            {{ cargando ? 'Guardando...' : 'Confirmar Asistencia ❄️' }}
          </button>
        </form>
      </div>

      <!-- Mensaje de éxito -->
      <div v-else class="bg-sky-900/80 p-6 rounded-2xl border border-sky-400/50 text-center space-y-3">
        <h3 class="text-xl font-bold text-sky-200">¡Gracias por confirmar! ❄️</h3>
        <p class="text-sm text-sky-300">Tus datos han quedado registrados en el sistema. ¡Nos vemos en la celebración!
        </p>
      </div>

    </div>
  </main>
</template>