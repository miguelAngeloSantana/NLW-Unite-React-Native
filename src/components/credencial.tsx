import { View, Text, Image, ImageBackground, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Feather } from "@expo/vector-icons";

import { colors } from '../styles/colors';

import { QRCode } from './qrcode';

import { BadgeData } from '../store/badge-store';

import { MotiView } from "moti";

type Props = {
  data: BadgeData
  onChangeAvatar?: () => void
  onClickQRCode?: () => void
}

export function Credencial({ data, onChangeAvatar, onClickQRCode }: Props) {

  const { height } = useWindowDimensions();

  return (
    <MotiView
      className='w-full self-stretch items-center'
      from={{
        opacity: 0,
        translateY: -height,
        rotateZ: "50deg",
        rotateX: "30deg",
        rotateY: "30deg",
      }}
      animate={{
        opacity: 1,
        translateY: 0,
        rotateZ: "0deg",
        rotateX: "0deg",
        rotateY: "0deg",
      }}
      transition={{
        type: "spring",
        damping: 20,
        rotateZ: {
          damping: 15,
          mass: 3
        }
      }}
    >

      <Image 
        source={require("../assets/ticket/band.png")}
        className='w-24 h-52 z-10'
      />

      <View className='bg-black/20 self-stretch items-center pb-6 border border-white/10 mx-3 rounded-2xl -mt-5'>
        <ImageBackground
            source={require("../assets/ticket/header.png")}
            className='px-6 py-8 h-40 items-center self-stretch border-b border-white/10 overflow-hidden'
        >
            <View className='w-full flex-row items-center justify-between'>
                <Text className='text-zinc-50 text-sm font-bold'>{data.eventTitle}</Text>
                <Text className='text-zinc-50 text-sm font-bold'>#{data.id}</Text>
            </View>

            <View className='w-40 h-40 bg-black rounded-full'/>
        </ImageBackground>

        {
          data.image? (
            <TouchableOpacity activeOpacity={0.9} onPress={onChangeAvatar}>
              <Image 
                source={{uri: data.image}}
                className='w-36 h-36 rounded-full -mt-24'
              />
            </TouchableOpacity>
          ): (
            <TouchableOpacity
              activeOpacity={0.9}
              style={{
                width: 144, 
                height: 144, 
                borderRadius: 9999, 
                marginTop: -96, 
                backgroundColor: "rgb(156 163 175)", 
                alignItems: "center", 
                justifyContent: "center"
              }}
              onPress={onChangeAvatar}
            >
              <Feather name='camera' size={32} color={colors.green[400]} />
            </TouchableOpacity>
          )
        }

        <Text className='font-bold text-2xl text-zinc-50 mt-4'>
            {data.name}
        </Text>

        <Text className='font-bold text-base text-zinc-300 mb-4'>
            {data.email}
        </Text>

        <QRCode value={data.checkInURL}  size={120} />

        <TouchableOpacity
            activeOpacity={0.7}
            style={{marginTop: 24}}
            onPress={onClickQRCode}
        >
            <Text className='font-bold text-orange-500 text-sm'>
                Amplicar QRCode
            </Text>
        </TouchableOpacity>
      </View>
    </MotiView>
  )
}