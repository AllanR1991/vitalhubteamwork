import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ContainerMargin, ContainerMarginStatusBar } from "../../components/Conatainer";
import { TextLabelBlack, Title } from "../../components/Texts/style";
import { useEffect, useState } from "react";
import { ClinicCardData } from "../../components/ClinicCardData";
import { ButtonDefault } from "../../components/Buttons";
import { LinkUnderlineDefault } from "../../components/Links";
import { MedicCardData } from "../../components/MedicCardData";
import { CalendarMonth } from "../../components/Calendars";
import RNPickerSelect from 'react-native-picker-select';
import { FontAwesome6 } from '@expo/vector-icons';
import { Dimensions } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { SummaryMedicalAgenda } from "../../components/Modals";
import moment from "moment";

const screenWidth = Dimensions.get('window').width;

export default function SelectDate({
  navigation,
  route
}) {

  const dataAtual = moment().format('YYYY-MM-DD');
  const [select, setSelect] = useState(null);
  const [showSummaryMedicalAgenda, setShowSummaryMedicalAgenda] = useState(false);
  const [dataSelecionada, setDataSelecionada] = useState(dataAtual);
  const [horaSelecionada, setHoraSelecionada] = useState(null);
  const [agendamento, setAgendamento] = useState({
    dataConsulta: null
  });
  const [buttonDisable,setButtonDisable] = useState(true)

  const [arrayOptions, setArrayOptions] = useState(
    null
  );

  function horariosEmAberto(){
    
    const horariosDisponiveis = [
      {label: '08:00', value: '08:00'},
      {label: '09:00', value: '09:00'},
      {label: '10:00', value: '10:00'},
      {label: '11:00', value: '11:00'},
      {label: '12:00', value: '12:00'},
      {label: '13:00', value: '13:00'},
      {label: '14:00', value: '14:00'},
      {label: '15:00', value: '15:00'},
      {label: '16:00', value: '16:00'},
      {label: '17:00', value: '17:00'},
      {label: '18:00', value: '18:00'},
      {label: '19:00', value: '19:00'},
      {label: '20:00', value: '20:00'},      
    ];
      
    const horaAtual = moment().format('HH:mm');
    //const horaAtual = moment.parseZone(dataatual, 'HH:mm');
    const horaInicial = moment.parseZone('08:00:00', 'HH:mm');
    console.log(`teste`,horaInicial)
    const horaFinal = moment.parseZone('20:00:00', 'HH:mm');
    const horaValida = moment.parseZone(horaAtual, 'HH:mm').isBetween(horaInicial,horaFinal, 'minutes',true)

    if(horaValida && (dataAtual == dataSelecionada)){
      const horariosValidos = [];
      console.log('hora atual', horaAtual)
      horariosDisponiveis.forEach(element => {
        
        const horaDisponivel = moment.parseZone(horaAtual, 'HH:mm').isBefore(moment.parseZone(element.value, 'HH:mm'), 'minutes',true)
        if(horaDisponivel){          
          horariosValidos.push({label: element.value, value: element.value})
        }
      });
      setArrayOptions(horariosValidos)
    }else{
      setArrayOptions(
        horariosDisponiveis
      )
    }
    
  }

  function handlecontinue() {
    setAgendamento({
      ...route.params.agendamento,
      dataConsulta: `${dataSelecionada} ${horaSelecionada}`
    });

    setShowSummaryMedicalAgenda(true)
  }  

  useEffect(() => {
    console.log(route);
  }, [route])

  useEffect(() => {
    horariosEmAberto() 
    setHoraSelecionada(null)   
  }, [dataSelecionada])

  return (
    <ContainerMarginStatusBar
      // $bgColor="pink"
      $bgColor="#FBFBFB"
    >
      <ContainerMargin $mt={30} $mb={30}>
        <Title>Selecionar data</Title>
      </ContainerMargin>

      <CalendarMonth
        dataSelecionada={dataSelecionada}
        setDataSelecionada={setDataSelecionada}
      />
      <ContainerMargin $alingItens="flex-start" $mt={30} $gap={10} >

        <TextLabelBlack>Selecione um horário disponível:</TextLabelBlack>


        <View key={dataSelecionada} style={{ width: '100%', borderWidth: 2, borderColor: '#34898F', borderStyle: "solid", borderRadius: 5 }}>
          {arrayOptions ? (
            <RNPickerSelect
              useNativeAndroidPickerStyle={false}
              fixAndroidTouchableBug={true}
              onValueChange={(value) => {
                setHoraSelecionada(value)
                if(value !== null){
                  setButtonDisable(false)
                }else{
                  setButtonDisable(true)
                }}
              }
              items={arrayOptions}
              placeholder={{ label: 'Seleciona Horário', value: null }}
              Icon={() => {
                return (
                  <TouchableOpacity>
                    <AntDesign name="caretdown" size={14} color="#34898F" />
                  </TouchableOpacity>
                )
              }}
              style={{
                iconContainer: {
                  height: '100%',
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 16,
                  zIndex: 0
                },
                headlessAndroidContainer: {
                  justifyContent: "center",
                },
                inputIOS: {
                  color: '#34898F',
                  padding: 16,
                },
                inputAndroid: {
                  color: '#34898F',
                  padding: 16,
                  width: '100%',
                  zIndex: 10,
                },
                inputWeb: {
                  color: '#34898F',
                  padding: 16,
                },
                placeholder: {
                  color: '#34898F',
                  fontFamily: 'MontserratAlternates_600SemiBold',
                  fontSize: 14,
                  height: 'auto',
                }
              }}
            />
          ) : (
            <ActivityIndicator />
          )}
        </View>
      </ContainerMargin>


      <ContainerMargin $mt={42} $mb={30} $gap={30}>
        <ButtonDefault
          textButton="Continuar"
          onPress={() => {
            if (dataSelecionada !== null && horaSelecionada !== null) {
              handlecontinue()
            }
          }} 
          disabled={buttonDisable}
          disabledInput={buttonDisable}
          />

        <LinkUnderlineDefault
          onPress={() => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Main' }]
            })
          }}
        >
          Cancelar
        </LinkUnderlineDefault>
      </ContainerMargin>


      {agendamento && (
        <SummaryMedicalAgenda
          agendamento={agendamento}
          showSummaryMedicalAgenda={showSummaryMedicalAgenda}
          setShowSummaryMedicalAgenda={setShowSummaryMedicalAgenda}
          navigation={navigation}
        />
      )}
    </ContainerMarginStatusBar>
  )
}