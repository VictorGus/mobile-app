import Icon from 'react-native-vector-icons/FontAwesome'; 
import IconFA from 'react-native-vector-icons/FontAwesome5'; 
import React from 'react';

function NotificationIcon(props) {
    switch (props.category) {
        case "pills":
            return <IconFA name="pills" style={props.style} size={29} color="#2396d9" />

        case "nutrition-order":
            return <Icon name="spoon" style={props.style} size={29} color="#2396d9" />

        case "water":
            return <IconFA name="glass-whiskey" style={props.style} size={29} color="#2396d9" />

        case "medical-service":
            return <IconFA name="briefcase-medical" style={props.style} size={29} color="#2396d9" />

        case "walking":
            return <IconFA name="walking" style={props.style} size={29} color="#2396d9" />

        case "activities":
            return <Icon name="soccer-ball-o" style={props.style} size={29} color="#2396d9" />
    }
}

function StatusIcon (props) {
    let iconColor;

    switch (props.status) {
        case "rejected":
            iconColor = '#ff4a40'
            break
        case "overdue":
            iconColor = '#fffc3d'
            break
        case "perfomed":
            iconColor = '#4ec726'
            break
    }

    return <Icon name='circle' size={32} style={{right: 0, position: 'absolute', margin: 8 }} color={iconColor}/>
}

export default NotificationIcon;