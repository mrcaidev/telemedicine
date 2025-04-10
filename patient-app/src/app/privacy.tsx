import { ScrollView, View } from "react-native";
import { Text } from "react-native-paper";

export default function PrivacyPolicyPage() {
  return (
    <ScrollView style={{ paddingHorizontal: 24 }}>
      <View style={{ height: 24 }} />
      <View style={{ marginBottom: 12 }}>
        <Text style={{ marginBottom: 16, fontSize: 32, fontWeight: "bold" }}>
          Privacy Policy
        </Text>
        <Text style={{ fontStyle: "italic" }}>
          Last updated on April 11, 2025
        </Text>
      </View>
      <Text style={{ marginTop: 12, fontSize: 20, fontWeight: "bold" }}>
        1 Introduction
      </Text>
      <Text style={{ marginTop: 8, lineHeight: 18 }}>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Necessitatibus
        quis praesentium beatae sint adipisci, neque deserunt explicabo
        laboriosam nisi voluptates recusandae voluptatibus, sapiente maxime,
        repudiandae nihil? Animi doloribus quaerat earum.
      </Text>
      <Text style={{ marginTop: 12, fontSize: 20, fontWeight: "bold" }}>
        2 How We Collect
      </Text>
      <Text style={{ marginTop: 8, lineHeight: 18 }}>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Magnam,
        cupiditate suscipit ad, dignissimos exercitationem numquam voluptas
        sequi ab laborum fuga quod. Dicta voluptates delectus dolores cupiditate
        vitae corporis, ducimus unde.
      </Text>
      <Text style={{ marginTop: 8, lineHeight: 18 }}>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ullam animi
        totam illo explicabo doloribus odio quisquam provident quos
        necessitatibus molestiae aliquid consequatur alias sit, voluptatem
        fugiat repudiandae itaque quasi numquam?
      </Text>
      <Text style={{ marginTop: 12, fontSize: 20, fontWeight: "bold" }}>
        3 How We Use
      </Text>
      <Text style={{ marginTop: 8, lineHeight: 18 }}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio
        fugiat ipsa nostrum iure omnis eligendi adipisci. Exercitationem,
        possimus reiciendis? Quibusdam voluptatum praesentium quo ad consequatur
        consectetur inventore eius esse? Odio!
      </Text>
      <Text style={{ marginTop: 8, lineHeight: 18 }}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus ab fugiat
        id, aliquam doloribus tempora dignissimos reprehenderit quae et nihil
        pariatur, harum quam est. Expedita nobis harum corporis cum delectus.
      </Text>
      <Text style={{ marginTop: 12, fontSize: 20, fontWeight: "bold" }}>
        4 How We Protect
      </Text>
      <Text style={{ marginTop: 8, lineHeight: 18 }}>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Labore odit
        optio repudiandae exercitationem. Optio accusamus itaque iste? Qui
        perspiciatis officia voluptatem praesentium laboriosam nostrum facilis
        accusantium, tempora cumque id omnis.
      </Text>
      <Text style={{ marginTop: 8, lineHeight: 18 }}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora rerum,
        quisquam itaque nam necessitatibus assumenda earum repellendus
        blanditiis corrupti esse dolorum quod sequi omnis quo exercitationem
        vitae laudantium? Quam, ratione?
      </Text>
      <View style={{ height: 72 }} />
    </ScrollView>
  );
}
