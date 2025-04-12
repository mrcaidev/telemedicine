import { Text } from "@/components/ui/text";
import { H1, H2, P } from "@/components/ui/typography";
import { ScrollView, View } from "react-native";

export default function TermsOfServicesPage() {
  return (
    <ScrollView className="px-6">
      <H1 className="mt-6">Terms of Services</H1>
      <Text className="mt-3 italic">Last updated on April 11, 2025</Text>
      <H2 className="mt-6">1 Introduction</H2>
      <P className="mt-3">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam aspernatur
        et, illo sunt nostrum temporibus consectetur hic cupiditate cum! Tempore
        nam sit a nulla doloremque exercitationem consequuntur nesciunt aliquid
        illo?
      </P>
      <H2 className="mt-6">2 Service Provided</H2>
      <P className="mt-3">
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Accusamus,
        dolore quidem ullam illo quae quod quia labore autem esse, voluptatum at
        vero sequi voluptatem quas ut ducimus id. Ipsa, accusamus.
      </P>
      <P className="mt-3">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eos deserunt,
        porro optio qui ullam mollitia nobis quas! Ut, quae. Id maxime nobis
        laudantium corrupti quam voluptatum voluptatem asperiores reiciendis
        expedita!
      </P>
      <P className="mt-3">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis ut
        voluptatibus tempora accusamus beatae assumenda nobis molestias cum
        quibusdam ipsa. Praesentium laboriosam eligendi asperiores? Neque
        adipisci totam debitis dolores maxime.
      </P>
      <H2 className="mt-6">3 Termination</H2>
      <P className="mt-3">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Est numquam
        earum, delectus possimus excepturi dolores vel quisquam similique
        debitis praesentium libero corrupti accusantium adipisci consequuntur id
        atque vitae aliquid reiciendis.
      </P>
      <H2 className="mt-6">4 Changes to Terms</H2>
      <P className="mt-3">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur
        commodi illo incidunt dolorem ducimus sint eos, pariatur debitis
        officiis, dolore ullam reprehenderit tempora! Quam reiciendis velit,
        quae rerum voluptate illo.
      </P>
      <P className="mt-3">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tenetur sint
        expedita nam quae enim reprehenderit voluptatem, repellat perspiciatis
        fugiat exercitationem ipsam ducimus laborum, repellendus reiciendis
        impedit error dolores excepturi nostrum.
      </P>
      <View className="h-20" />
    </ScrollView>
  );
}
