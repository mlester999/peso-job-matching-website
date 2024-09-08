import {format, parse, isToday, isYesterday, parseISO, getDay, formatDistanceToNow} from 'date-fns'

const datefns: any={
  format,
  isToday,
  isYesterday,
  parse,
  parseISO,
  getDay,
  formatDistanceToNow
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('datefns', datefns)
})