import {Text, View, Image} from 'react-native';
import React from 'react';
import {Link} from "expo-router";
import {SafeAreaView as RNSafeAreaView} from "react-native-safe-area-context";
import {styled} from "nativewind";
import {formatCurrency} from "@/lib/utils";




const SafeAreaView = styled( RNSafeAreaView)
const UpcomingSubscriptionCard = ({
                                      name,
                                      price,
                                      daysLeft,
                                      icon,
                                      currency
                                  }: UpcomingSubscription) => {
    return(
        <View className="upcoming-card">
<View className="upcoming-row">
    <Image source={icon} className="upcoming-icon"/>

    <View>
        <Text className="upcoming-price">{formatCurrency(price,currency?? "USD")}</Text>
        <Text className="upcoming-meta"  numberOfLines={1}>
            {daysLeft > 1 ? `${daysLeft} days left` :  'Last day'}

                </Text>
    </View>
</View>

            <Text className="upcoming-name" numberOfLines={1}>
                {name}
            </Text>
        </View>
    )
}

export default UpcomingSubscriptionCard