export function FormatDate (
  date,
  formatter = '{yyyy}-{MM}-{dd} {hh}:{mm}:{ss}'
) {
  let dateInstance = null
  if (typeof date === 'string' || typeof date === 'number') {
    try {
      dateInstance = new Date(date)
    } catch (error) {
      throw "Invalid parameter 'date', a valid date string or Date instance is required."
    }
  } else if (date instanceof Date) {
    dateInstance = date
  }
  let y = dateInstance.getFullYear()
  let M = dateInstance.getMonth() + 1
  let d = dateInstance.getDate()
  let h = dateInstance.getHours()
  let m = dateInstance.getMinutes()
  let s = dateInstance.getSeconds()
  if (formatter.indexOf('MM')) {
    M = M > 9 ? M : '0' + M
  }

  if (formatter.indexOf('dd')) {
    d = d > 9 ? d : '0' + d
  }

  if (formatter.indexOf('hh')) {
    h = h > 9 ? h : '0' + h
  }

  if (formatter.indexOf('mm')) {
    m = m > 9 ? m : '0' + m
  }

  if (formatter.indexOf('ss')) {
    s = s > 9 ? s : '0' + s
  }

  formatter = formatter
    .replace(/\{yyyy\}/, y)
    .replace(/\{(M|MM)\}/, M)
    .replace(/\{(d|dd)\}/, d)
    .replace(/\{(h|hh)\}/, h)
    .replace(/\{(m|mm)\}/, m)
    .replace(/\{(s|ss)\}/, s)
  return formatter
}
