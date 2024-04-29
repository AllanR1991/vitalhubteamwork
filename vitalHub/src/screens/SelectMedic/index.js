import { FlatList, Text } from "react-native";
import { ContainerMargin, ContainerMarginStatusBar } from "../../components/Conatainer";
import { Title } from "../../components/Texts/style";
import { useEffect, useState } from "react";
import { ClinicCardData } from "../../components/ClinicCardData";
import { ButtonDefault } from "../../components/Buttons";
import { LinkUnderlineDefault } from "../../components/Links";
import { MedicCardData } from "../../components/MedicCardData";
import api from "../../service/Service";

export default function SelectMedic({
  navigation,
  route
}) {

  const [select, setSelect] = useState(null)
  const [medicosLista, setMedicosLista] = useState([]);

  async function ListarMedicos(){
    //Instanciar a chamada da api
    api.get(`/Medicos/BuscarPorIdClinica?id=${route.params.agendamento.clinicaId}`)
    .then( response => {
      setMedicosLista(medicosLista)
      console.log(data);
    }).catch( error =>{
      console.log(error);
    })
  }

  function handleContinue() {
    navigation.replace("SelectDate", {
      agendamento: {
        ...route.params.agendamento,
        ...medicosLista
      }
    })
  }

  useEffect(() => {
    ListarMedicos();
  }, [])

  return (
    <ContainerMarginStatusBar
      $bgColor="#FBFBFB"
    >
      <ContainerMargin $mt={30} $mb={30}>
        <Title>Selecionar Médico</Title>
      </ContainerMargin>

      <FlatList
        data={medicosLista}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MedicCardData
            data={item}
            onPress={() => setSelect(item.id)}
            select={select === item.id}
            
          />
        )}
        style={{
          width: '90%',
        }}
        showsVerticalScrollIndicator={false}
      >
      </FlatList>

      <ContainerMargin $mt={30} $mb={35} $gap={30} $width="80%">
        <ButtonDefault textButton="Continuar" onPress={handleContinue()} />

        <LinkUnderlineDefault
          onPress={() => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Main' }]
            });
          }}
        >
          Cancelar
        </LinkUnderlineDefault>
      </ContainerMargin>

    </ContainerMarginStatusBar>
  )
}