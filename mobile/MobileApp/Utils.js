function formatDateTime(date) {
    if (date != null) {
        let month = '' + (date.getMonth() + 1).toString()
        let day = '' + date.getDate().toString()
        let year = date.getFullYear().toString()
        let hour = date.getHours().toString()
        let minute = date.getMinutes().toString()

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;
        if (hour.length < 2)
            hour = '0' + hour;
        if (minute.length < 2)
            minute = '0' + minute;

        return [hour, minute].join(':') + " " + [day, month, year].join('.');
    }
}

export { formatDateTime };