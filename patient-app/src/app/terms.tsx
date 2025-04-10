import { ScrollView, View } from "react-native";
import { Text } from "react-native-paper";

export default function TermsOfServicePage() {
  return (
    <ScrollView style={{ paddingHorizontal: 24 }}>
      <View style={{ height: 24 }} />
      <View style={{ marginBottom: 12 }}>
        <Text style={{ marginBottom: 16, fontSize: 32, fontWeight: "bold" }}>
          Terms of Services
        </Text>
        <Text style={{ fontStyle: "italic" }}>
          Last updated on April 11, 2025
        </Text>
      </View>
      <Text style={{ marginTop: 12, fontSize: 20, fontWeight: "bold" }}>
        1 Introduction
      </Text>
      <Text style={{ marginTop: 8, lineHeight: 18 }}>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Cum harum
        ipsam ratione odit numquam laudantium enim dolores voluptatem non
        temporibus porro nihil iure, totam autem quas odio ad neque quod.
      </Text>
      <Text style={{ marginTop: 12, fontSize: 20, fontWeight: "bold" }}>
        2 Service Provided
      </Text>
      <Text style={{ marginTop: 8, lineHeight: 18 }}>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sunt earum
        libero id quisquam quaerat facilis enim ipsum! Et, eius voluptatem? Non
        eaque iusto cupiditate eius fugit incidunt officiis maxime perferendis!
      </Text>
      <Text style={{ marginTop: 8, lineHeight: 18 }}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis quae odit
        fugit ipsam aperiam sapiente, repellendus reprehenderit odio alias
        adipisci cumque. Magnam omnis debitis inventore asperiores doloribus
        enim quam minus.
      </Text>
      <Text style={{ marginTop: 12, fontSize: 20, fontWeight: "bold" }}>
        3 Termination
      </Text>
      <Text style={{ marginTop: 8, lineHeight: 18 }}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore earum
        ipsa excepturi beatae reiciendis! Perspiciatis officiis provident
        ducimus accusamus, recusandae aut voluptatibus, architecto quod eius
        harum facere magnam sunt corrupti.
      </Text>
      <Text style={{ marginTop: 8, lineHeight: 18 }}>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Cumque
        laboriosam, repellat enim dolor quia quis aperiam exercitationem illum
        veritatis ratione accusantium doloribus fugit nulla modi assumenda
        voluptas repudiandae architecto earum.
      </Text>
      <Text style={{ marginTop: 12, fontSize: 20, fontWeight: "bold" }}>
        4 Changes to Terms
      </Text>
      <Text style={{ marginTop: 8, lineHeight: 18 }}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni, a.
        Repudiandae cumque fugiat officiis amet, cupiditate ipsa officia
        expedita, aut omnis corporis nihil laudantium harum obcaecati modi.
        Esse, ipsam provident?
      </Text>
      <Text style={{ marginTop: 8, lineHeight: 18 }}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure sunt
        mollitia quisquam, dolor libero ipsam nisi quis dicta modi possimus
        repellat nulla ut architecto eos ex sint voluptas. Quas, praesentium!
      </Text>
      <View style={{ height: 72 }} />
    </ScrollView>
  );
}
