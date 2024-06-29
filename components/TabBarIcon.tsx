import MaterialIcons from "react-native-vector-icons/MaterialIcons";


const TabBarIcon = ({name, size, color}:{name:string, size:number, color:string}) => {
  return (
    <MaterialIcons name={name} color={color} size={size}/>
  )
}

export default TabBarIcon