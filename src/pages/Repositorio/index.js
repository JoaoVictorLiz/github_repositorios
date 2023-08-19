import React, {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'
import {FaArrowLeft} from 'react-icons/fa'
import {Container, Owner,Loading,BackButton,IssuesList,PageActions, FilterList} from './styles'
import api from '../../services/api'

export default function Repositorio() {
  const { repositorio } = useParams()

  const [repositorios, setRepositorios] = useState({})
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState([
    {state: 'all', label: 'Todas', active: true},
    {state: 'open', label: 'Abertas', active: false},
    {state: 'closed', label: 'Fechadas', active: true},
  ])
  const [filterindex, setFilterIndex] = useState(0)


  useEffect(() => {
    async function load() {

      const [repositorioData, issuesData] = await Promise.all([
        api.get(`/repos/${repositorio}`),
        api.get(`/repos/${repositorio}/issues`, {
          params:{
            state: filters.find(f => f.active).state,
            per_page: 5
          }
        }) 
      ]);

     setRepositorios(repositorioData.data)
     setIssues(issuesData.data)
     setLoading(false)
    }

    load()
  }, [repositorio])

  useEffect(() => {

    async function loadIssue(){
      const response = await api.get(`/repos/${repositorio}/issues`, {
        params: {
          state: filters[filterindex].state, 
          page,
          per_page: 5,
        }
      });

      setIssues(response.data)
    }

    loadIssue()

  }, [filterindex,filters,page])

  function handlePage(action) {
    setPage(action === 'back' ? page - 1 : page + 1)
  }

  function handleFilter(index){
    setFilterIndex(index)
  }

  if(loading) {

    return(
      <Loading>
        <h1>Carregando...</h1>
      </Loading>
    )
    
  }

  return (
   <Container>
    <BackButton to='/'>
      <FaArrowLeft color='#000' size={30}/>
    </BackButton>

    <Owner>
      <img src={repositorios.owner.avatar_url} alt={repositorios.owner.login}/>
      <h1>{repositorios.name}</h1>
      <p>{repositorios.description}</p>
    </Owner>


    <FilterList active={filterindex}>
      {filters.map((filter, index) => (
        <button type='button' key={filter.label} onClick={() => handleFilter(index)}>{filter.label}</button>
      ))}
    </FilterList>

    <IssuesList>
      {issues.map(issue => (
        <li key={String(issue.id)}>
          <img src={issue.user.avatar_url} alt={issue.user.login}/>

          <div>
            <strong>
              <a href={issue.html_url} target='_blank' >{issue.title}</a>

              {issue.labels.map(label => (
                <span key={label.id}>{label.name}</span>
              ))}
            </strong>
            <p>{issue.user.login}</p>
          </div>

        </li>
      ))}
    </IssuesList>


    <PageActions>
      <button type='button' onClick={() => handlePage('back')}  disabled={page < 2}>Anterior</button>

      <button type='button' onClick={() => handlePage('next')}>Proximo</button>
    </PageActions>

   </Container>
  )
}
