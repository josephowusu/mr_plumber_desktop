const { Notification  } = require('electron/main')

const storeData = (key, data) => {
    window.localStorage.removeItem(key)
    window.localStorage.setItem(key, JSON.stringify({
        dataType: typeof data,
        dataValue: data
    }))
}

const fetchData = (key) => {
    let result = window.localStorage.getItem(key)
    if (result) {
        result = JSON.parse(result)
        return result.dataValue
    }

    return null
}

const deleteData = (key) => {
    window.localStorage.removeItem(key)
}

const customNotify = () => {
    // const options = {
    //     title: 'Custom Notification',
    //     subtitle: 'Subtitle of the Notification',
    //     body: 'Body of Custom Notification',
    //     silent: false,
    //     // icon: path.join(__dirname, './../public/appAssets/images/backgroundLogin2.png'),
    //     hasReply: true,  
    //     timeoutType: 'never', 
    //     replyPlaceholder: 'Reply Here',
    //     // sound: path.join(__dirname, './media/'),
    //     urgency: 'critical',
    //     closeButtonText: 'Close Button',
    //     actions: [ {
    //         type: 'button',
    //         text: 'Show Button'
    //     }]
    // }
    // const notification = new Notification(options)
    // notification.show()
}

const checkSession = () => {
    let sessionData = fetchData('session')
    return sessionData ? true : false
}


const customEventListener = (selector, event, handler) => {
    let rootElement = document.querySelector('body')
    rootElement.addEventListener(event, function (evt) {
            var targetElement = evt.target
            while (targetElement != null) {
                if (targetElement.matches(selector)) {
                    handler(evt)
                    return
                }
                targetElement = targetElement.parentElement
            }
        },
        true
    )
}

const customRemoveEventListener = (selector, event, handler) => {
    let rootElement = document.querySelector('body')
    rootElement.removeEventListener(event, function (evt) {
            var targetElement = evt.target
            while (targetElement != null) {
                if (targetElement.matches(selector)) {
                    handler(evt)
                    return
                }
                targetElement = targetElement.parentElement
            }
        },
        true
    )
}

const toggleChildrenDisplay = (elementIdName) => {
    const parentElement = document.getElementById(`${elementIdName}`)
    if (parentElement) {
        for (let i = 0; i < parentElement.children.length; i++) {
            const child = parentElement.children[i]
            child.style.display = 'none'
        }
    }
}


const loadPageInner = (elementIdName, html) => {
    const elementToLoadChildren = document.getElementById(`${elementIdName}`)
    if (elementToLoadChildren) {
        clearChildren(elementIdName)
        elementToLoadChildren.innerHTML = html
    } else {
        console.log('element not found')
    }
}

const datePicker = (el) => {
    const { getData } = window.phoenix.utils
    const userOptions = getData(el, 'options')
    flatpickr(el, {
        nextArrow: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--! Font Awesome Pro 6.1.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M96 480c-8.188 0-16.38-3.125-22.62-9.375c-12.5-12.5-12.5-32.75 0-45.25L242.8 256L73.38 86.63c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l192 192c12.5 12.5 12.5 32.75 0 45.25l-192 192C112.4 476.9 104.2 480 96 480z"/></svg>`,
        prevArrow: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--! Font Awesome Pro 6.1.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M224 480c-8.188 0-16.38-3.125-22.62-9.375l-192-192c-12.5-12.5-12.5-32.75 0-45.25l192-192c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25L77.25 256l169.4 169.4c12.5 12.5 12.5 32.75 0 45.25C240.4 476.9 232.2 480 224 480z"/></svg>`,
        locale: {
            firstDayOfWeek: 0,
            shorthand: ['S', 'M', 'T', 'W', 'T', 'F', 'S']
        },
        monthSelectorType: 'static',
        onDayCreate: (dObj, dStr, fp, dayElem) => {
            if (dayElem.dateObj.getDay() === 5 || dayElem.dateObj.getDay() === 6) {
                dayElem.className += ' weekend-days'
            }
        },
        ...userOptions
    })
}


const camelize = (str) => {
    const text = str.replace(/[-_\s.]+(.)?/g, (_, c) =>
        c ? c.toUpperCase() : ''
    )
    return `${text.substr(0, 1).toLowerCase()}${text.substr(1)}`
}

const getDataset = (el, data) => {
    try {
        return JSON.parse(el.dataset[camelize(data)])
    } catch (e) {
        return el.dataset[camelize(data)]
    }
}

const clearCookies = () => {
    let cookies = document.cookie.split("; ")
    for (let c = 0; c < cookies.length; c++) {
        let d = window.location.hostname.split(".")
        while (d.length > 0) {
            let cookieBase = encodeURIComponent(cookies[c].split(";")[0].split("=")[0]) + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; domain=' + d.join('.') + ' ;path='
            let p = location.pathname.split('/')
            document.cookie = cookieBase + '/'
            while (p.length > 0) {
                document.cookie = cookieBase + p.join('/')
                p.pop()
            };
            d.shift()
        }
    }
}

const clearStorage = () => {
    window.localStorage.clear()
}

const spinner = () => {
    const template = document.createElement('template')
    template.innerHTML = (String.raw`
        <span class="spinner-border spinner-border-sm text-danger" role="status" aria-hidden="true"></span>
        <span> &nbsp; Submitting...</span>
    `)
    return template.content.cloneNode(true)
}

const shortenText = (text, maxLength, suffix = '...') => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + suffix
    }
    return text
}

const customCurrencyFormat = (amount, symbol = 'GHS', decimals = 2, thousandSeparator = ',', decimalSeparator = '.', symbolFirst = true) => {
    let amountStr = amount.toFixed(decimals)
    let [integerPart, decimalPart] = amountStr.split('.')
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator)
    amountStr = integerPart + (decimals > 0 ? decimalSeparator + decimalPart : '')
    if (symbolFirst) {
        return symbol + amountStr
    } else {
        return amountStr + symbol
    }
}

function formatCurrency(amount, locale = 'en-US', currency = 'GHS') {
    return new Intl.NumberFormat(locale, { style: 'currency', currency: currency }).format(amount);
}

function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charactersLength);
        result += characters.charAt(randomIndex);
    }
    return result;
}

const clearChildrenWithQuerySelector = (elementIdName) => {
    const elementToClearChildren = document.querySelector(`${elementIdName}`)
    if (elementToClearChildren) {
        let child = elementToClearChildren.lastElementChild
        while (child) {
            elementToClearChildren.removeChild(child)
            child = elementToClearChildren.lastElementChild
        }
    }
}



const clearChildren = (elementIdName) => {
    const elementToClearChildren = document.getElementById(`${elementIdName}`)
    if (elementToClearChildren) {
        let child = elementToClearChildren.lastElementChild
        while (child) {
            elementToClearChildren.removeChild(child)
            child = elementToClearChildren.lastElementChild
        }
    }
}

const gLightboxInit = (selector) => {
    if (window.GLightbox) {
        window.GLightbox({
            selector: `${selector ? selector + ' ' : ''}[data-gallery]`
        })
    }
}


const searchableSelect = (el) => {
    const userOptions = getDataset(el, 'options')
    new window.Choices(el, {
        itemSelectText: '',
        addItems: true,
        ...userOptions
    })
}



const startSpinning = (selector, loadingText) => {
    const spinnerDiv = document.querySelector(selector)
    if (spinnerDiv) {
        spinnerDiv.replaceChildren()
        spinnerDiv.appendChild(spinner(loadingText))
        spinnerDiv.setAttribute('disabled', 'disabled')
    }
}

const stopSpinning = (selector, htmlString) => {
    const spinnerDiv = document.querySelector(selector)
    if (spinnerDiv) {
        spinnerDiv.replaceChildren()
        spinnerDiv.innerHTML = htmlString ? htmlString : 'Submit'
        spinnerDiv.removeAttribute('disabled')
    }
}

const toUcwords = (value) => {
    if (value) {
        value = value.toString()
        return value.replace(/\w+/g, function (a) {
            return a.charAt(0).toUpperCase() + a.slice(1).toLowerCase()
        })
    } else {
        return ''
    }
}


const cloneTemplate = (htmlString) => {
    const template = document.createElement('template')
    template.innerHTML = htmlString
    return template.content.cloneNode(true)
}

const formatCashValue = (num) => {
    num = Number(num)
    if (isNaN(num)) {
        return ''
    } else {
        return num.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
    }
}

const momentFromNow = (value) => {
    return moment(value).fromNow()
}

const toSentenceCase = (value) => {
    if (value) {
        value = value.toString()
        let cap = value[0].toUpperCase()
        let first = value[0]
        return value.replace(first, cap)
    } else {
        return ''
    }
}

const stopSpinningWithEl = (targetEl, htmlString) => {
    if (targetEl) {
        targetEl.replaceChildren()
        targetEl.innerHTML = htmlString ? htmlString : 'Submit'
        targetEl.removeAttribute('disabled')
    }
}

const returnValue = (value) => {
    return value ? value : ''
}

const toCustomCurrency = (amount) => {
    return Math.abs(Number(amount)).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

const customDate = (value, yearType = 4) => {
    let date
    if (value) {
        date = new Date(value)
    } else {
        date = new Date()
    }

    if (yearType == 4) {
        let dd = date.getUTCDate()
        dd = dd < 10 ? '0' + dd : dd

        let yyyy = date.getFullYear()

        const month = date.toLocaleString('default', { month: 'short' });

        return `${month} ${dd}, ${yyyy}`

    } else if (yearType == 2) {

        let dd = date.getUTCDate()
        dd = dd < 10 ? '0' + dd : dd

        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        let day = days[date.getUTCDay()]

        let yyyy = date.getFullYear()

        const month = date.toLocaleString('default', { month: 'long' })

        return `${day.toUpperCase()}, ${dd} ${month.toUpperCase()} ${yyyy}`
    }
}

const getTIme = (value) => {
    return moment(value).format("LT")
}

const printCommand = (bodySelector) => {
    let docHead = document.head.innerHTML
    let printArea = document.querySelector(bodySelector).innerHTML
    let newWindow = window.open('', '', 'height=768, width=1024')
    newWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
    `)
    newWindow.document.write(docHead)
    newWindow.document.write(`
        </head>
        <body>
    `)
    newWindow.document.write(printArea)
    newWindow.document.write(`
        <script>
            (()=>{
                setTimeout(()=>{
                    window.print()
                }, 1000)

                window.onafterprint = function closeWindow() {
                    window.close()
                }
            })()
        </script>
    `);
    newWindow.document.write(` </body> `)
    newWindow.focus()
    newWindow.document.close()
}

const fileSizeShorts = (value) => {
    let numberValue = value.toString()
    if (numberValue.toString().length >= 10) {
        return (Number(numberValue) / 1000000000).toFixed(2) + ' GB'
    } else if (numberValue.toString().length >= 7) {
        return (Number(numberValue) / 1000000).toFixed(2) + ' MB'
    } else if (numberValue.toString().length >= 4) {
        return (Number(numberValue) / 1000).toFixed(2) + ' kB'
    } else {
        return Number(numberValue) + ' bytes'
    }
}

const shuffle = (value) => {
    let a = value.toString().split(""), n = a.length
    for (let i = n - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1))
        let tmp = a[i]
        a[i] = a[j]
        a[j] = tmp
    }
    return a.join("")
}

const fullDateTime = (value) => {
    let date
    if (value) {
        date = new Date(value)
    } else {
        date = new Date()
    }

    let hh = date.getUTCHours()
    hh = hh < 10 ? '0' + hh : hh

    let mm = date.getUTCMinutes() + 1
    mm = mm < 10 ? '0' + mm : mm

    let ss = date.getUTCSeconds()
    ss = ss < 10 ? '0' + ss : ss

    return date.toDateString() + ' - Time ' + hh + ':' + mm
}

const fullDate = (value) => {
    let date
    if (value) {
        date = new Date(value)
    } else {
        date = new Date()
    }

    let dd = date.getUTCDate()
    dd = dd < 10 ? '0' + dd : dd

    let mm = date.getUTCMonth() + 1
    mm = mm < 10 ? '0' + mm : mm

    let yyyy = date.getUTCFullYear()

    return date.toDateString()
}

const fullTime = (value) => {
    let date
    if (value) {
        date = new Date(value)
    } else {
        date = new Date()
    }

    let hh = date.getUTCHours()
    let am = hh <= 11 ? 'AM' : 'PM'
    hh = hh < 10 ? '0' + hh : hh

    let mm = date.getUTCMinutes()
    mm = mm < 10 ? '0' + mm : mm

    let ss = date.getUTCSeconds()
    ss = ss < 10 ? '0' + ss : ss

    return hh + ':' + mm + ' ' + am
}

const fullDateBD = (value) => {
    let date
    if (value) {
        date = new Date(value)
    } else {
        date = new Date()
    }

    let dd = date.getUTCDate()
    dd = dd < 10 ? '0' + dd : dd

    let mm = date.getUTCMonth() + 1
    mm = mm < 10 ? '0' + mm : mm

    let yyyy = date.getUTCFullYear()

    return yyyy+'-'+mm+'-'+dd
}

const getValueFromAttribute = (target, attribute) => {
    const value = target.getAttribute(attribute)
    if (value) {
        return value
    } else {
        getValueFromAttribute(target.parentNode)
    }
}



const getThumbnail = (file, url) => {
    let ext = file.split('.')
    ext = ext[ext.length - 1]
    ext = ext.toString().toLowerCase()

    if (ext == 'png' || ext == 'jpg' || ext == 'jpeg' || ext == 'gif' || ext == 'webp') {
        return (String.raw`<img class="rounded-2 dz-image" src="${url}" alt="image" data-dz-thumbnail="data-dz-thumbnail" style="width: 80px; height: 80px;" />`)

    } else if (ext == 'mp4' || ext == 'mpeg') {
        return (String.raw`<span class="fas fa-file-video"></span>`)

    } else if (ext == 'mp3') {
        return (String.raw`<span class="fas fa-file-audio"></span>`)

    } else if (ext == 'docx' || ext == 'doc') {
        return (String.raw`<span class="fas fa-file-word"></span>`)

    } else if (ext == 'pdf') {
        return (String.raw`<span class="fas fa-file-pdf"></span>`)

    } else if (ext == 'csv' || ext == 'xlsx') {
        return (String.raw`<span class="fas fa-file-csv"></span>`)

    } else if (ext == 'ppt') {
        return (String.raw`<span class="fas fa-file-powerpoint"></span>`)

    } else if (ext == 'zip') {
        return (String.raw`<span class="fas fa-file-archive"></span>`)

    } else {
        return (String.raw`<span class="fas fa-file-upload"></span>`)
    }
}

const amountToWords = (num, currencyMainName = 'Ghana Cedis', coinsName = 'Pesewas') => {
    if (Number(num)) {
        let a = ['','One ','Two ','Three ','Four ', 'Five ','Six ','Seven ','Eight ','Nine ','Ten ','Eleven ','Twelve ','Thirteen ','Fourteen ','Fifteen ','Sixteen ','Seventeen ','Eighteen ','Nineteen ']
        let b = ['', '', 'Twenty','Thirty','Forty','Fifty', 'Sixty','Seventy','Eighty','Ninety']

        num = Number(num).toFixed(2).toString()
        num = num.split('.')
        let pesewas = num[1] ? num[1] : '0'
        num = num[0]

        if (num.length > 9) return ''

        n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/)
        if (!n) return ''

        let str = ''
        str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Billion ' : ''
        str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Million ' : ''
        str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : ''
        str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : ''
        str += (n[5] != 0) ? ((str != '') ? 'And ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : ''
        str += ' ' + currencyMainName

        if (pesewas && pesewas != '0') {
            n = ('000000000' + pesewas).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/)
            if (!n) return str

            str += (n[5] != 0) ? ' And ' + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : ''
            str += ' ' + coinsName
        }

        return str
    } else {
        return ''
    }
}

const amountToWordsObject = (num) => {
    if (Number(num)) {
        let a = ['','One ','Two ','Three ','Four ', 'Five ','Six ','Seven ','Eight ','Nine ','Ten ','Eleven ','Twelve ','Thirteen ','Fourteen ','Fifteen ','Sixteen ','Seventeen ','Eighteen ','Nineteen ']
        let b = ['', '', 'Twenty','Thirty','Forty','Fifty', 'Sixty','Seventy','Eighty','Ninety']

        num = Number(num).toFixed(2).toString()
        num = num.split('.')
        let pesewas = num[1] ? num[1] : '0'
        num = num[0]

        if (num.length > 9) return ''

        let str = '', strPesewas = ''

        n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/)
        if (!n) {
            str = ''
        } else {
            str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Billion ' : ''
            str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Million ' : ''
            str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : ''
            str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : ''
            str += (n[5] != 0) ? ((str != '') ? 'And ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : ''
        }

        if (pesewas && pesewas != '0') {
            n = ('000000000' + pesewas).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/)
            if (!n) {
                strPesewas = ''
            } else {
                strPesewas += (n[5] != 0) ? (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : ''
            }
        }

        return {
            main: str,
            pesewas: strPesewas
        }
    } else {
        return {
            main: '',
            pesewas: ''
        }
    }
}

const getNextOrPreviousDate = (date, number, type) => {
    const currentDate = new Date(date)
    if (type === 'next') {
        currentDate.setDate(currentDate.getDate() + number)
    } else {
        currentDate.setDate(currentDate.getDate() - number)
    }

    let month = currentDate.getUTCMonth() + 1
    month = month > 9 ? month : '0'+month

    let day = currentDate.getUTCDate()
    day = day > 9 ? day : '0'+day

    return currentDate.getUTCFullYear()+'-'+month+'-'+day
}

module.exports = {
    storeData,
    fetchData,
    deleteData,
    checkSession,
    customEventListener,
    customRemoveEventListener,
    toggleChildrenDisplay,
    clearChildren,
    clearCookies,
    clearStorage,
    camelize,
    getDataset,
    spinner,
    loadPageInner,
    customNotify,
    shortenText,
    customCurrencyFormat,
    formatCurrency,
    generateRandomString,
    clearChildrenWithQuerySelector,
    cloneTemplate,
    formatCashValue,
    returnValue,
    datePicker,
    searchableSelect,
    toUcwords,
    startSpinning,
    stopSpinning,
    printCommand,
    gLightboxInit,
    momentFromNow,
    toSentenceCase,
    stopSpinningWithEl,
    customDate,
    toCustomCurrency,
    getTIme,
    fileSizeShorts,
    shuffle,
    fullDateTime,
    fullDate,
    fullDateBD,
    fullTime,
    getValueFromAttribute,
    getThumbnail,
    amountToWords,
    amountToWordsObject,
    getNextOrPreviousDate
}