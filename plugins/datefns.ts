import {format, parse, isToday, isYesterday, parseISO, getDay} from 'date-fns'

const datefns: any={
  format,
  isToday,
  isYesterday,
  parse,
  parseISO,
  getDay
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('datefns', datefns)
})