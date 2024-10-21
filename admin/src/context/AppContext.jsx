import { createContext } from "react";

export const AppContext = createContext()

const AppContextProvider = (props) => {

    const currency = 'Rs'

    const calculateAge = (dob) => {
        const today = new Date()
        const birthDate = new Date(dob)

        let age = today.getFullYear() - birthDate.getFullYear()
        return age
    }

    const months = ["", "Jan", "Feb", "March", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    const slotDateFormat = (slotDate) => {
        const dateArry = slotDate.split('_')
        return dateArry[0] + "" + months[Number(dateArry[1])] + " " + dateArry[2]
    }
    const value = {
        calculateAge, slotDateFormat, currency
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider