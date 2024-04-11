import { useState } from "react";
import { View, StatusBar, ScrollView, Text, TouchableOpacity, Modal, Alert, Share } from "react-native";
import { FontAwesome } from "@expo/vector-icons"
import * as ImagePicker from "expo-image-picker"

import { Redirect } from "expo-router";

import { useBadgeStore } from "../store/badge-store"; 
import { BadgeData } from "../store/badge-store";

import { Header } from "../components/header";
import { Credencial } from "../components/credencial";
import { Button } from "../components/button";
import { QRCode } from "../components/qrcode";

import { MotiView } from "moti";

interface PropsBadgeData {
    data: BadgeData
}

export default function Ticket() {

    const [expandQRCode, setExpandQRCode] = useState(false)

    const badgeStore = useBadgeStore();

    async function handleShare() {
        try {
            if (badgeStore.data?.checkInURL) {
                await Share.share({
                    message: badgeStore.data.checkInURL
                }) 
            }
        } catch(error) {
            console.log(error);
            Alert.alert("Compartilhar", "Não foi possivel compartilhar!");
        }
    }

    async function handleSelectImage() {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 4]
            })

            if (result.assets) {
                badgeStore.saveImage(result.assets[0].uri)
            }
        } catch(error) {
            console.log(error);
        }
    }

    if (!badgeStore.data?.checkInURL) {
        return <Redirect  href={"/"}/>
    }

    return (
        <View className="flex-1 bg-green-500">
            <StatusBar barStyle={"light-content"} />
            <Header title="Minha credencial"/>
            <ScrollView
                className="-mt-28 -z-10"
                contentContainerClassName="px-8 pb-8"
                showsVerticalScrollIndicator={false}
            >
                <Credencial
                    data={badgeStore.data} 
                    onChangeAvatar={handleSelectImage} 
                    onClickQRCode={()=> setExpandQRCode(true)}
                />


                <MotiView
                    from={{
                        translateY: 0
                    }}
                    animate={{
                        translateY: 10
                    }}
                    transition={{
                        loop: true,
                        type: "timing",
                        duration: 700,
                    }}
                >
                    <FontAwesome 
                        name="angle-double-down"
                        size={24}
                        className="self-center my-6"
                        color={"white"}
                    />
                </MotiView>

                <Text className="text-white  font-bold text-2xl mt-4">
                    Compartilhar credencial
                </Text>

                <Text className="text-white font-regular text-base mt-1 mb-6">
                    Mostre que sua presença está confirmada para o {badgeStore.data.eventTitle}!
                </Text>
            
                <Button title="Compartilhar" onPress={handleShare}/>

                <TouchableOpacity 
                    activeOpacity={0.7} 
                    style={{ marginTop: 40 }} 
                    onPress={() => badgeStore.remove()}
                >
                    <Text className="text-white text-base font-bold text-center">Remover Ingresso</Text>
                </TouchableOpacity>
            </ScrollView>

            <Modal visible={expandQRCode} statusBarTranslucent animationType="slide">
                <View className="flex-1 bg-green-500 items-center justify-center">
                    <TouchableOpacity activeOpacity={0.7} onPress={() => setExpandQRCode(false)}>
                        <QRCode value={badgeStore.data.checkInURL} size={300} />
                        <Text className="text-sm text-orange-500 font-bold text-center mt-10">Fechar</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    )
}