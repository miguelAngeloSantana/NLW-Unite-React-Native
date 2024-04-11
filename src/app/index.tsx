import { useState } from "react";
import { View, Image, StatusBar, Alert, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Link, Redirect } from 'expo-router';
import { colors } from "../styles/colors";

import { api } from "../server/api";

import { useBadgeStore } from "../store/badge-store";

import { Button } from "../components/button"
import { Input } from "../components/input";

export default function Home() {

    const [userIngresso, setUserIngresso] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const badgeStore = useBadgeStore();

    async function handleAcessCredencial() {
        try {

            if(!userIngresso.trim()) {
                return Alert.alert("Credencial", "Informe o codigo do ingresso");
            }

            setIsLoading(true);

            const { data } = await api.get(`/attendees/${userIngresso}/badge`);
            badgeStore.save(data.badge);

        }catch(error) {
            console.log(error);
            setIsLoading(false);
            Alert.alert("Credencial", "Não foi possivel encontrar esse ingresso!");
        }
    }

    if (badgeStore.data?.checkInURL) {
        return <Redirect href={"/ticket"}/>
    }

    return (
        <View className="flex-1 items-center justify-center bg-green-500 p-8">
            <StatusBar barStyle='light-content'/>
            <Image 
                source={require("../assets/logo.png")}
                className="h-16"
                resizeMode="contain"
            />

            <View className="w-full mt-12 gap-3">
                <Input>
                    <MaterialCommunityIcons 
                        name="ticket-confirmation-outline"
                        size={20}
                        color={colors.green[200]}
                    />
                    <Input.Field placeholder="Codigo do ingresso" onChangeText={setUserIngresso}/>
                </Input>

                    <Button title="Acessar credencial" onPress={handleAcessCredencial} isLoading={isLoading}/>   

                <Link
                    href={"./register"}
                    className="text-gray-400 text-base font-bold text-center mt-8"
                >
                    Ainda não possui seu ingresso?
                </Link>
            </View>
        </View>
    )
}