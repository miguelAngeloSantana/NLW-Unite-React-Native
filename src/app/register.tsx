import { useState } from "react";
import { View, Image, StatusBar, Alert } from "react-native";
import { FontAwesome6, MaterialIcons } from "@expo/vector-icons";
import { Link, router } from 'expo-router';
import axios from "axios";

import { colors } from "../styles/colors";

import { api } from "../server/api";
import { useBadgeStore } from "../store/badge-store";
import { Input } from "../components/input";
import { Button } from "../components/button";

const EVENT_ID = "9e9bd979-9d10-4915-b339-3786b1634f33";

export default function Register() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);


    const badgeStore = useBadgeStore();

    async function handleUserInformation() {
        try {

            if (!name.trim() || !email.trim()) {
                return Alert.alert("Inscrição", "Preencha todas as informações");
            }

            setIsLoading(true);


            const responseAPi = await api.post(`/events/${EVENT_ID}/attendees`, { 
                name, 
                email 
            })

            if (responseAPi.data.attendeeId) {
                
                const badgeResponse = await api.get(
                    `/attendees/${responseAPi.data.attendeeId}/badge`
                )

                badgeStore.save(badgeResponse.data.badge);
                
                Alert.alert("Inscrição", "Inscrição realizada com sucesso!", [
                    {text: "Ok", onPress: () => router.push("./ticket")},
                ])
            }
        }catch (error) {
            console.log(error);
            setIsLoading(false);
            
            if (axios.isAxiosError(error)) {
                if(String(error.response?.data.menssage).includes("already registered")) {
                    return Alert.alert("Inscrição", "Este e-mail já está registrado");
                }
            }

            if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
                return Alert.alert("Inscrição", "E-mail invalidado!");
            }

            Alert.alert("Inscrição", "Não foi possivel realizar a inscrição");
        }
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
                    <FontAwesome6 
                        name="user-circle"
                        size={20}
                        color={colors.green[200]}
                    />
                    <Input.Field placeholder="Nome completo (max: 3 letras)" onChangeText={setName}/>
                </Input>

                <Input>
                    <MaterialIcons 
                        name="alternate-email"
                        size={20}
                        color={colors.green[200]}
                    />
                    <Input.Field 
                        placeholder="E-mail pessoal" 
                        keyboardType="email-address" 
                        onChangeText={setEmail}
                    />
                </Input>

                <Button title="Confirmar inscrição" onPress={handleUserInformation} isLoading={isLoading}/>

                <Link 
                    href="/" 
                    className="text-gray-400 text-base font-bold text-center mt-8"
                >
                    Já possui seu ingresso?
                </Link>
            </View>
        </View>
    )
}