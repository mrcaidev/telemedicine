import { Text } from "@/components/ui/text";
import { H1, H2, P } from "@/components/ui/typography";
import { ScrollView, View } from "react-native";

export default function PrivacyPolicyPage() {
  return (
    <ScrollView className="px-6">
      <H1 className="mt-6">Privacy Policy</H1>
      <Text className="mt-3 italic">Last updated on April 11, 2025</Text>
      <H2 className="mt-6">1 Introduction</H2>
      <P className="mt-3">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Necessitatibus
        quis praesentium beatae sint adipisci, neque deserunt explicabo
        laboriosam nisi voluptates recusandae voluptatibus, sapiente maxime,
        repudiandae nihil? Animi doloribus quaerat earum.
      </P>
      <H2 className="mt-6">2 How We Collect</H2>
      <P className="mt-3">
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Magnam,
        cupiditate suscipit ad, dignissimos exercitationem numquam voluptas
        sequi ab laborum fuga quod. Dicta voluptates delectus dolores cupiditate
        vitae corporis, ducimus unde.
      </P>
      <P className="mt-3">
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ullam animi
        totam illo explicabo doloribus odio quisquam provident quos
        necessitatibus molestiae aliquid consequatur alias sit, voluptatem
        fugiat repudiandae itaque quasi numquam?
      </P>
      <H2 className="mt-6">3 How We Use</H2>
      <P className="mt-3">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio
        fugiat ipsa nostrum iure omnis eligendi adipisci. Exercitationem,
        possimus reiciendis? Quibusdam voluptatum praesentium quo ad consequatur
        consectetur inventore eius esse? Odio!
      </P>
      <P className="mt-3">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus ab fugiat
        id, aliquam doloribus tempora dignissimos reprehenderit quae et nihil
        pariatur, harum quam est. Expedita nobis harum corporis cum delectus.
      </P>
      <H2 className="mt-6">4 How We Protect</H2>
      <P className="mt-3">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Labore odit
        optio repudiandae exercitationem. Optio accusamus itaque iste? Qui
        perspiciatis officia voluptatem praesentium laboriosam nostrum facilis
        accusantium, tempora cumque id omnis.
      </P>
      <P className="mt-3">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora rerum,
        quisquam itaque nam necessitatibus assumenda earum repellendus
        blanditiis corrupti esse dolorum quod sequi omnis quo exercitationem
        vitae laudantium? Quam, ratione?
      </P>
      <View className="h-20" />
    </ScrollView>
  );
}
