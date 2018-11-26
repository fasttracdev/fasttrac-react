export default class PhoneNumberFormat {
  transform(number, format) {
    if (!number) return number
    switch (format) {
      case 'US':
        var num = String(number);
        var n = []
        n[0] = num.substring(0, 3)
        n[1] = num.substring(3, 6)
        n[2] = num.substring(6, num.length)
        return '(' + n[0] + ') ' + n[1] + '-' + n[2]
      default:
        return number
    }
  }
}
