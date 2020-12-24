import NetInfo from "@react-native-community/netinfo";

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

function extractDate(date) {
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

        return [day, month, year].join('.');
    }
}

function exractTime(date) {
    if (date != null) {
        let hour = date.getHours().toString()
        let minute = date.getMinutes().toString()

        if (hour.length < 2)
            hour = '0' + hour;
        if (minute.length < 2)
            minute = '0' + minute;

        return [hour, minute].join(':');
    }
}

function normalizeDateTime(date) {
    if (date != null) {
        let month = '' + (date.getMonth() + 1).toString()
        let day = '' + date.getDate().toString()
        let year = date.getFullYear().toString()
        let hour = date.getHours();
        let minute = date.getMinutes();
        let second = date.getSeconds();
        let hourString = hour < 10 ? '0' + hour.toString() : hour.toString();
        let minuteString = minute < 10 ? '0' + minute.toString() : minute.toString();
        let secondString = second < 10 ? '0' + second.toString() : second.toString();

        return [year, month, day].join('-') + " " + [hourString, minuteString, secondString].join(':');
    }
}

function clearFormState (setters) {
    setters.map((fn) => fn(null));
}

async function jsonFetch (query) {

    let params =  query.params != null ? Object.entries(query.params).reduce((acc, [k, v]) => { return acc + k + "=" + v + '&'}, '?') : null;

    let uri = params != null ? query.uri + params : query.uri;

    delete query["uri"];
    delete query["params"];

    let connection = {};

    await NetInfo.fetch().then(state => {
        connection.isConnected = state.isConnected;
        connection.type = state.type;
    })

    return await fetch('http://ec2-3-9-239-1.eu-west-2.compute.amazonaws.com' + uri, query)
        .then((response) => response.json())
        .then((json) => {
            return json;
        })
        .catch((error) => {
            console.error(error);
        })
}

function convertRateToMills (rateText) {
    const timeInMills = {
        day: 86400000,
        week: 604800000,
        month: 2592000000,
        year: 31536000000,
        hour: 3600000,
        minute: 60000
    }

    let rateParts = rateText.replace('every ', '').replace('s', '').split(' ');

    if (rateParts.length > 1) {
        return parseInt(rateParts[0]) * timeInMills[rateParts[1]];
    } else {
        return timeInMills[rateParts[0]];
    }
}

export { formatDateTime, jsonFetch, convertRateToMills, clearFormState, normalizeDateTime, extractDate, exractTime };
