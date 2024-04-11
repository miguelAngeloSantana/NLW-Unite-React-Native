import { TouchableOpacity, TouchableOpacityProps, Text, ActivityIndicator } from "react-native";

type Props = TouchableOpacityProps & {
    title: string
    isLoading?: boolean
}

export function Button({ title, isLoading=false, ...rest }: Props) {
    return ( 
        <TouchableOpacity 
            activeOpacity={0.7}
            disabled={isLoading}
            style={{
                width: "100%", 
                height: 56, 
                backgroundColor:"rgb(244 143 86)", 
                alignItems: "center", 
                justifyContent: "center", 
                borderRadius: 8
            }}
            //rgb(249 115 22)
            className="w-full h-14 bg-orange-500 items-center justify-center rounded-lg"
            {...rest}
        >
            {
                isLoading? <ActivityIndicator className="text-gray-500"/>:
                    <Text className="text-green-400 text-base font-bold uppercase">
                        {title}
                    </Text>
            }
        </TouchableOpacity>
    )
}