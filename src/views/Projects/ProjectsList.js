import React, { Component } from 'react';
import {
  Row,
  Col,
  Card,
  Form,
  Badge,
  Modal,
  FormGroup,
  CardHeader,
  CardBody,
  CardFooter,
  ModalHeader,
  ModalBody,
  ModalFooter,
  CardTitle,
  Button,
  ButtonGroup,
  Label,
  Input,
  Table
} from 'reactstrap';

import { AvForm, AvGroup, AvInput, AvFeedback } from 'availity-reactstrap-validation';

import ReactTable from 'react-table'
import { toastAlerts } from '../Shared/toast_alert';
import 'react-table/react-table.css'

import { connect } from 'react-redux';
import { createProject, getProjects, deleteProjectAction } from '../../actions/AppActions';
import Spinner from '../Spinner/Spinner';
import { style } from 'react-toastify';

style({
  colorProgressDefault: 'white'
});

class ProjectsList extends Component {

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.showProject = this.showProject.bind(this);
    this.onCreateProject = this.onCreateProject.bind(this);
    this.deleteProject = this.deleteProject.bind(this);
    this.loadProjects = this.loadProjects.bind(this);
    this.reactTableColumns = this.reactTableColumns.bind(this);

    this.state = {
      createModal: false,
      deleteModal: false,
      projects: [{}],
      deleteRowId: 0
    }
  }

  componentWillMount() {
    this.loadProjects()
  }

  componentWillReceiveProps(props) {
    if (props.projects !== undefined) {
      this.setState({
        projects: props.projects,
        projectName: '',
        projectDesc: ''
      })
    }
  }

  deleteProject() {
    this.toggle('delete', this.state.deleteRowId)
    this.props.dispatch(deleteProjectAction(
      this.state.deleteRowId,
      (status, response) => {
        this.loadProjects();
        toastAlerts(status, response)
      }
    ))
  }


  render() {
    return (
      <div>
        <Spinner display={this.props.loading}/>
        <Modal isOpen={this.state.deleteModal} toggle={() => this.toggle('delete')} className="text-right">
          <ModalHeader>حذف پروژه</ModalHeader>
          <ModalBody>
            <h3>آیا از حذف پروژه مطمئن هستید؟</h3>
            <br/>
            <h5>پس از حذف پروژه امکان بازگرداندن آن وجود ندارد.</h5>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" className="ml-1" onClick={() => {
              this.deleteProject(this.state.deleteRowId)
            }}>حذف</Button>
            <Button color="danger" onClick={() => this.toggle('delete')}>انصراف</Button>
          </ModalFooter>
        </Modal>


        <Modal isOpen={this.state.createModal} toggle={() => this.toggle('create')} className="text-right">
          <ModalHeader>پروژه جدید</ModalHeader>
          <ModalBody>
            <AvForm>
              <AvGroup row>
                <Label sm={3}>نام پروژه : </Label>
                <Col sm={9}>
                  <AvInput type="text"
                           name={'projectName'}
                           onChange={event => this.setState({
                             projectName: event.target.value
                           })}
                           required/>
                  <AvFeedback>الزامی است</AvFeedback>
                </Col>
              </AvGroup>
              <AvGroup row>
                <Label sm={3}>توضیحات :‌ </Label>
                <Col sm={9}>
                  <AvInput type="textarea"
                           name={'projectDescription'}
                           rows="2"
                           style={{resize: 'none'}}
                           onChange={event => this.setState({
                             projectDesc: event.target.value
                           })}/>
                </Col>
              </AvGroup>
            </AvForm>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" className="ml-1" onClick={() => {
              this.toggle('create')
              this.props.dispatch(createProject({
                'name': this.state.projectName,
                'description': this.state.projectDesc,
              }, this.onCreateProject))
            }}>ذخیره</Button>
            <Button color="danger" onClick={() => this.toggle('create')}>انصراف</Button>
          </ModalFooter>
        </Modal>


        <Card className="text-justify">
          <CardHeader>
            <CardTitle className="mb-0 font-weight-bold h6">لیست پروژه‌ها</CardTitle>
          </CardHeader>
          <CardBody>
            <ReactTable
              data={this.state.projects}
              columns={this.reactTableColumns()}
              pageSizeOptions={[5, 10, 25]}
              nextText='بعدی'
              previousText='قبلی'
              filterable={true}
              rowsText='ردیف'
              pageText='صفحه'
              ofText='از'
              minRows='1'
              noDataText='داده ای وجود ندارد'
              resizable={false}
              defaultPageSize={5}
              className="-striped -highlight"
            />
          </CardBody>
          <CardFooter>
            <Button onClick={() => this.toggle('create')} color="primary">پروژه جدید</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  reactTableColumns() {
    return [
      {
        Header: 'نام پروژه',
        accessor: 'name'
      },
      {
        Header: 'توضیحات',
        accessor: 'description'
      },
      {
        Header: 'صاحب پروژه',
        accessor: 'owner.name'
      },
      {
        id: 'projectStatus',
        Header: 'وضعیت',
        filterable: false,
        accessor: row => <Badge color={row.active === true ? 'success' : 'danger'}>
          {row.active === true ? 'فعال' : 'غیرفعال'}
        </Badge>
      },
      {
        id: 'rowTools',
        Header: 'امکانات',
        filterable: false,
        accessor: row => <div>
          <Button onClick={() => this.showProject(row._id)} className="ml-1" color="success"
                  size="sm">نمایش</Button>
          <Button onClick={() => this.manageProject(row._id)} className="ml-1" color="warning"
                  size="sm">مدیریت</Button>
          <Button onClick={() => this.toggle('delete', row._id)} className="ml-1" color="danger"
                  size="sm">حذف</Button>
        </div>
      }
    ];
  }

  toggle(modal, id) {
    let state = {};
    if (modal == 'delete')
      state = {
        deleteModal: !this.state.deleteModal,
        deleteRowId: id
      }
    if (modal == 'create')
      state = {
        createModal: !this.state.createModal,
      }
    this.setState(state);
  }


  onCreateProject(status, message) {
    toastAlerts(status, message)
  }

  loadProjects() {
    this.props.dispatch(getProjects())
  }

  showProject(id) {
    window.location = `#/projects/view/${id}`
  }

  manageProject(id) {
    window.location = `#/projects/manage/show/${id}`
  }


}

function mapStateToProps(state) {
  return {
    projects: state.projectReducer,
    loading: state.homeReducer.currentlySending
  };
}


export default connect(mapStateToProps)(ProjectsList);
