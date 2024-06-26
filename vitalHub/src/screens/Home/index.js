import { FlatList, StatusBar, Text, View } from "react-native";
import { Container, ContainerMargin } from "../../components/Conatainer";
import { Header } from "../../components/Header";
import { CalendarListWeek } from "../../components/Calendars";
import { ButtonSelect } from "../../components/Buttons";
import { useEffect, useState } from "react";
import CardAppointment from "../../components/CardAppointment";
import { ModalCancel, ModalMedicalRecord, ModalScheduleAppointment, ModalShowLocalConsult } from "../../components/Modals";
import { Stethoscope } from "../../components/Stethoscope";
import { userDecodeToken } from "../../utils/Auth";
import moment from "moment";
import api from "../../service/Service";
import { useIsFocused } from "@react-navigation/native";

export default function Home(
  {
    navigation,
    route
  }
) {

  const [showModalCancel, setShowModalCancel] = useState(false);
  const [showModalMedicalRecord, setShowModalMedicalRecord] = useState(false);
  const [showModalScheduleAppointment, setShowModalScheduleAppointment] = useState(false);
  const [showModalShowLocalConsult, setShowModalShowLocalConsult] = useState(false);
  const [consultSelect, setConsultSelect] = useState({});
  const [dadosCard, setDadosCard] = useState({});
  const [consultas, setConsultas] = useState({});
  const [dadosSituacoes, setDadosSituacoes] = useState({});
  const [dateConsult, setDateConsult] = useState('');
  const [profile, setProfile] = useState({});
  const [renderizaDados, setRenderizaDados] = useState(false);
  const [foto, setFoto] = useState('')
  const [select, setSelect] = useState(route.params && route.params.situacaoSelecionada ? route.params.situacaoSelecionada : 'Agendadas');
  const [situacao, setSituacao] = useState("");
  const [filteredConsultas, setFilteredConsultas] = useState([])

  const statusConsult = ['Agendadas', 'Realizadas', 'Canceladas'];
  const { name, role } = profile;

  //console.log(profile)
  // Função para obter os dados descriptografados do token
  async function profileLoad() {
    const token = await userDecodeToken();
    setProfile(token);
    setDateConsult(route.params && route.params.dateConsulta ? route.params.dateConsulta : moment().format('YYYY-MM-DD'))
  }

  async function ListaSituacoes() {
    await api.get('/Situacao/ListarTodas')
      .then(response => {
        setDadosSituacoes(response.data)
      })
      .catch(error => {
        console.log('Erro ao listar dados de Situações : ,', error)
      })
  }

  async function ListarConsultas() {
    const url = (profile.role == 'Medico' ? 'Medicos' : 'Pacientes')
    await api.get(`/${url}/BuscarPorData?data=${dateConsult}&id=${profile.id}`)
      .then(response => {
        setConsultas(response.data);
        console.log('Response data: ', response.data)
        setFilteredConsultas(response.data.filter(item => item.situacao && item.situacao.situacao && item.situacao.situacao === select))
      }).catch(error => {
        console.log('Erro ao listar Consultas: ', error);
      })
  }

  async function buscarUsuarioId() {
    await api.get(`/Usuario/BuscarPorId?id=${profile.id}`)
      .then(
        response => {
          setFoto(response.data.foto)
        }
      ).catch(
        error => {
          console.log(`Erro ao buscar por id : ${error}`)
        }
      )
  }

  //Executando a função ProfileLoad
  useEffect(() => {
    profileLoad();
    ListaSituacoes();
  }, [])

  useEffect(() => {
    if (profile.id !== undefined) {
      buscarUsuarioId()
    }
    if (dateConsult !== '') {
      ListarConsultas();
    }
  }, [dateConsult, useIsFocused(), renderizaDados, select])

  return (
    <Container $bgColor="#fbfbfb">

      <StatusBar translucent={true} barStyle="light-content" backgroundColor={'transparent'} />

      <Header navigation={navigation} name={name} role={role} foto={foto} />

      <ContainerMargin $mt={20}>
        <CalendarListWeek dateConsult={dateConsult} setDateConsult={setDateConsult} />
      </ContainerMargin>

      <ContainerMargin $fd="row" $justContent="space-between" $mt={38}>
        {statusConsult.map((status, index) => (
          <ButtonSelect key={index} selectStatus={select === status} onPress={() => { setSelect(status) }} texto={status} />
        ))}
      </ContainerMargin>

      <Container style={{ width: '90%', marginTop: 30 }}>
        <FlatList
          data={filteredConsultas}
          renderItem={({ item }) =>

            select == item.situacao.situacao && (
              <CardAppointment
                setSituacao={item.situacao.situacao}
                data={item}
                role={profile.role}
                navigation={navigation}
                selectStatus={select}
                setShowModalCancel={setShowModalCancel}
                setShowModalMedicalRecord={setShowModalMedicalRecord}
                setShowModalShowLocalConsult={setShowModalShowLocalConsult}
                setConsultSelect={setConsultSelect}
                setSelect={setSelect}
                setDadosCard={setDadosCard}

              />)

          }
          keyExtractor={item => item.id}
          style={{
            width: '100%',
          }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => {
            if (role == 'Medico' && select == 'Agendadas') {
             return <Text>Não há nenhum atendimento para o dia. </Text>
            }
            if(role == 'Medico' && select == 'Realizadas'){
             return <Text>Não há nenhum consulta realizada.</Text>
            }
            if(select == 'Canceladas'){
             return <Text>Nenhum consulta foi cancelada.</Text>
            }

            if (role == 'Paciente' && select == 'Agendadas') {
             return <Text>Não há nenhuma consulta agendada, caso queria realizar uma consulta, clique no botão verde no canto inferiror direito da tela. </Text>
            }
            if(role == 'Paciente' && select == 'Realizadas'){
             return <Text>Nenhum consulta foi realizada.</Text>
            }

            
          }}
        />
      </Container>

      {
        role === 'Paciente' ?
          <Stethoscope
            onPress={() => setShowModalScheduleAppointment(true)}
          /> :
          <></>
      }

      <ModalCancel
        consultSelect={consultSelect}
        dadosSituacoes={dadosSituacoes}
        setShowModalCancel={setShowModalCancel}
        showModalCancel={showModalCancel}
        setRenderizaDados={setRenderizaDados}
        renderizaDados={renderizaDados}
      />
      <ModalMedicalRecord
        navigation={navigation}
        consultSelect={consultSelect}
        profile={profile}
        dadosSituacoes={dadosSituacoes}
        setShowModalMedicalRecord={setShowModalMedicalRecord}
        showModalMedicalRecord={showModalMedicalRecord}
        role={role}
      />

      {/* Modal Agendar Consulta */}
      <ModalScheduleAppointment
        setShowModalScheduleAppointment={setShowModalScheduleAppointment}
        showModalScheduleAppointment={showModalScheduleAppointment}
        navigation={navigation}
      />

      <ModalShowLocalConsult
        consultSelect={consultSelect}
        navigation={navigation}
        showModalShowLocalConsult={showModalShowLocalConsult}
        setShowModalShowLocalConsult={setShowModalShowLocalConsult}
        dadosCard={dadosCard}
      />

    </Container>
  )
}

