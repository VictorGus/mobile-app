import Icon from 'react-native-vector-icons/FontAwesome'; 
import IconFA from 'react-native-vector-icons/FontAwesome5'; 
import React from 'react';
import { Picker } from '@react-native-picker/picker'
import { Text, View, StyleSheet, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import { formatDateTime } from './Utils';
import DateTimePicker from 'react-native-modal-datetime-picker';


function NotificationIcon(props) {
    switch (props.category) {
        case "pills":
            return <IconFA name="pills" style={props.style} size={29} color="#2396d9" />

        case "nutrition-order":
            return <Icon name="spoon" style={props.style} size={29} color="#2396d9" />

        case "water":
            return <IconFA name="glass-whiskey" style={props.style} size={29} color="#2396d9" />

        case "medical-services":
            return <IconFA name="briefcase-medical" style={props.style} size={29} color="#2396d9" />

        case "walking":
            return <IconFA name="walking" style={props.style} size={29} color="#2396d9" />

        case "activities":
            return <Icon name="soccer-ball-o" style={props.style} size={29} color="#2396d9" />
            
        default:
            return <Icon name="exclamation" size={29} color="#2396d9" />
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

[{type: "select", label: "Category", onChange: ()=>{}, initialValue: "test", items: [{value: "k", display: "baz"}]}]

function FormField(props) {
    const [isDatePickerVisible, setDatePickerVisibility] = React.useState(false);
    const showDatePicker = () => {
        setDatePickerVisibility(true);
      };

    let field = props.field;

    switch (field.type) {
        case "select":
            return (
                <View>
                    <Text style={{
                        fontWeight: 'bold',
                        marginBottom: 15,
                        fontSize: 16
                    }}>
                        {field.label}
                    </Text>
                    <Picker
                        style={styles.textInput}
                        onValueChange={field.onChange}
                        mode={'dropdown'}
                        selectedValue={field.initialValue}>
                        {field.items.map((item, i) => {
                            return (
                                <Picker.Item key={i} label={item.display} value={item.value} />
                            )
                        })}
                    </Picker>
                </View>
            )
        case "datetime":
            return (
                <View>
                    <Text style={{
                        fontWeight: 'bold',
                        fontSize: 16
                    }}>
                        {field.label}
                    </Text>
                    <TouchableOpacity onPress={showDatePicker} >
                        <View style={styles.dateInput}>
                            <Text style={{ fontSize: 18 }}>
                                {
                                    formatDateTime(field.initialValue)
                                }
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <DateTimePicker
                        isVisible={isDatePickerVisible}
                        value={Date.now()}
                        onCancel={() => { setDatePickerVisibility(false) }}
                        onConfirm={(date) => {
                            field.onChange(date);
                            setDatePickerVisibility(false);
                        }}
                        mode={"datetime"}
                        is24Hour={true}
                        display="default"
                    />
                </View>
            )
        case "text":
            return (
                <View>
                    <Text style={{
                        fontWeight: 'bold',
                        fontSize: 16
                    }}>
                        {field.label}
                    </Text>
                    <TextInput
                        style={styles.textInput}
                        placeholder={field.placeholder}
                        defaultValue={field.initialValue}
                        inputStyle={{
                            paddingBottom: 0
                        }}
                        maxLength={35}
                        onEndEditing={field.onChange}
                        onBlur={Keyboard.dismiss}
                    />
                </View>
            )
    }
}

function InputForm (props) {

    let fields = props.fields;
    return (
        <View>
            {
                fields.map((field, index) => (
                    <View key={index} >
                        <FormField field={field} />
                   </View>
                ))
    }
        </View >
    )
}

const styles = StyleSheet.create({
    dateInput: {
        borderColor: '#CCCCCC',
        borderBottomWidth: 3,
        width: "100%",
        marginLeft: 6,
        marginRight: 6,
        marginTop: 15,
        height: 30
    },

    textInput: {
        borderColor: '#CCCCCC',
        borderBottomWidth: 3,
        marginBottom: 10,
        width: "100%",
        fontSize: 18,
    }
})

export {InputForm, NotificationIcon};