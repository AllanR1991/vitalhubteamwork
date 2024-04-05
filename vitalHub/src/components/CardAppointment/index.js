import { ContainerMargin } from "../Conatainer"

import { NivelConsult, TextCancelAppointment, TextNameUserBlack, TextPontuarioAppointment, TextQuickSandRegular, TitleHeader } from "../Texts/style"
import { Entypo } from '@expo/vector-icons';
import { Time } from "../Time";
import { ImageUser } from "../Images/style";
import moment from "moment";
import { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";

export default CardAppointment = (
  {
    navigation,
    setShowModalCancel,
    setShowModalMedicalRecord,
    setConsultSelect,
    selectStatus,
    data,
    role
  }
) => {
  const [idade, setIdade] = useState();

  const roles = role == 'Medico' ? data.paciente : data.medicoClinica.medico;
  // console.log('Dados medico : ', data)
   console.log('dados da consulta: ',data)
   console.log('roles : ',roles)

  const dataNascimento = roles.dataNascimento
  const foto = roles.idNavigation.foto
  const tipoConsulta = data.prioridade.prioridade
  const nomePaciente= data.paciente.idNavigation.nome ;
  const email=  data.paciente.idNavigation.email; 
  // const descricaoConsulta= ;
  // const diagnosticoPaciente= ; 
  // const prescricaoMedica= ;

  console.log('dados consulta teste: ', data.medicoClinica.medico) 

  const calculateAge = () => {
    const dob = moment(dataNascimento, 'YYYY-MM-DD');
    const today = moment();
    const years = today.diff(dob, 'years');
    setIdade(years);
  };

  useEffect(() => {
    calculateAge();
  }, [])

  return (
    <ContainerMargin $pd="11px 10px" $mb={20} $fd="row" $bgColor="#FFF" $width="100%" $gap={10} $borderRadius={5} style={{ elevation: 5 }}>
    <TouchableOpacity 
      style={{ width: '100%', height: "auto", flexDirection: "row", gap: 10}} 
      activeOpacity={0.7} 
      onPress={()=>{
        role == 'Medico'? 
          navigation.navigate('MedicalRecord') :
          navigation.navigate('ConsultationAddress', {clinica: data.medicoClinica.clinicaId })
      }}  
    >
        <ImageUser $width="77px" $height="80px" source={foto !== undefined && foto !== 'string' ? { uri: foto } : require('../../assets/images/NotImage.svg')} />

        <ContainerMargin $width='none' $alingItens="flex-start" style={{ flex: 1 }} >
          <TextNameUserBlack>{roles.idNavigation.nome}</TextNameUserBlack>
          <ContainerMargin $fd="row" $gap={7} $mt={5} $mb={11} $justContent="flex-start" $width="content">
            <TextQuickSandRegular>
              {
                dataNascimento < 2 ?
                  idade + ' ano' :
                  dataNascimento === undefined ?
                    'CRM - ' + roles.crm :
                    idade + ' anos'
              }
            </TextQuickSandRegular>
            <Entypo name="dot-single" size={10} color="#D9D9D9" />
            <NivelConsult>{tipoConsulta == 1 ? 'Rotina' : tipoConsulta == 2 ? 'Exame' : 'Urgência'}</NivelConsult>
          </ContainerMargin>
          <ContainerMargin $width="100%" $fd="row" $justContent="space-between" >
            <Time timeConsult={'10:00'} selectStatus={selectStatus === 'Agendadas'} />
            {
              selectStatus === 'Agendadas' ?
                <TextCancelAppointment onPress={() => {
                  setShowModalCancel(true)
                  setConsultSelect(data)
                }}>
                  Cancelar
                </TextCancelAppointment>
                : selectStatus === 'Realizadas' ?
                  <TextPontuarioAppointment
                    onPress={() => {
                      setShowModalMedicalRecord(true)
                      setConsultSelect(data)
                    }}
                  >
                    Ver Prontuario</TextPontuarioAppointment>
                  : <></>
            }
          </ContainerMargin>
        </ContainerMargin>


    </TouchableOpacity>
      </ContainerMargin>
  )
}