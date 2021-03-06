import React, {Component} from 'react'
import {connect} from 'react-redux'
import {
    Alert,
    Button,
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Col,
    Form,
    FormGroup,
    Input,
    Label,
    ListGroup,
    ListGroupItem,
    Row
} from 'reactstrap'
import {buyPackagesAction, getPackageAction} from '../../actions/AppActions'
import {toastAlerts} from '../Shared/toast_alert'
import {Link} from 'react-router-dom'

class SelectedPackage extends Component {

    constructor(props) {
        super(props);
        this.pay = this.pay.bind(this);
        this.state = {
            package: {},
            agree: false,
            discountCode: ''
        }
    }

    componentWillReceiveProps(props) {
        this.setState({
            package: props.package,
        })
    }

    componentWillMount() {
        this.props.dispatch(getPackageAction(this.props.match.params.id));
    }

    pay() {
        if (this.state.agree === false) {
            toastAlerts(false, 'لطفا قوانین را بپذیرید');
            return
        }
        this.props.dispatch(buyPackagesAction(this.props.match.params.id, this.state.discountCode, toastAlerts))
    }

    render() {
        return (
            <div>

                <Card className="text-justify">
                    <CardHeader>
                        <CardTitle className="mb-0 font-weight-bold h6">بسته منتخب </CardTitle>
                    </CardHeader>
                    <CardBody>
                        <Alert color="primary">
                            <h4 className="alert-heading">توجه</h4>
                            <p>{'لطفا پس از حصول اطمینان از انتخاب صحیح بسته، بر روی دکمه پرداخت کلیک کنید.'}</p>
                        </Alert>
                        <Card>
                            <CardHeader>
                                <CardTitle className="mb-0 font-weight-bold h6">
                                    <i className="fa fa-align-justify"/><strong> مشخصات خریدار </strong>
                                </CardTitle>
                            </CardHeader>
                            <CardBody>
                                <ListGroup>
                                    <ListGroupItem>
                                        <Row>
                                            <Col md='6'><strong>{'نام و نام‌خانوادگی'}</strong></Col>
                                            <Col md='6'><span>{this.props.data.username}</span></Col>
                                        </Row>
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        <Row>
                                            <Col md='6'><strong>ایمیل</strong></Col>
                                            <Col md='6'><span>{this.props.data.email}</span></Col>
                                        </Row>
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        <Row>
                                            <Col md='6'><strong> تلفن همراه</strong></Col>
                                            <Col md='6' style={{
                                                direction: 'ltr',
                                                textAlign: 'right'
                                            }}><span>{this.props.data.mobile}</span></Col>
                                        </Row>
                                    </ListGroupItem>

                                </ListGroup>
                            </CardBody>
                        </Card>


                        <Card>
                            <CardHeader>
                                <CardTitle className="mb-0 font-weight-bold h6">
                                    <i className="fa fa-align-justify"/><strong>مشخصات بسته:</strong>
                                </CardTitle>
                            </CardHeader>
                            <CardBody>
                                <ListGroup>
                                    <ListGroupItem>
                                        <Row>
                                            <Col md='6'><strong> نام بسته</strong></Col>
                                            <Col md='6'><span>{this.state.package.name}</span></Col>
                                        </Row>
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        <Row>
                                            <Col md='6'><strong> مبلغ قابل پرداخت</strong></Col>
                                            <Col md='6'>
                                                <span>{this.state.package.price}</span>
                                                <span>ریال</span>
                                            </Col>
                                        </Row>
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        <Row>
                                            <Col md='6'><strong>تعداد سنسور</strong></Col>
                                            <Col md='6'><span>{this.state.package.node_num}</span></Col>
                                        </Row>
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        <Row>
                                            <Col md='6'><strong>تعداد پروژه</strong></Col>
                                            <Col md='6'><span>{this.state.package.project_num}</span></Col>
                                        </Row>
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        <Row>
                                            <Col md='6'><strong>زمان بسته</strong></Col>
                                            <Col md='6'><span>{this.state.package.time}</span></Col>
                                        </Row>
                                    </ListGroupItem>
                                </ListGroup>
                            </CardBody>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="mb-0 font-weight-bold h6"> <i
                                    className="icon-basket-loaded icons"/>درگاه پرداخت</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <Row>
                                    <Col md="5">
                                        <Input className="pay-input-style back3" type="radio" id="radio3"
                                               name="radios"
                                               defaultChecked={true}
                                               value="زرین پال"/>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                        <Card>
                            <CardBody>
                                <Form>
                                    <FormGroup check className={'text-right'}>
                                        <Label check>
                                            <Input type="checkbox"
                                                   onChange={() => this.setState({agree: !this.state.agree})}
                                            />
                                            &emsp;
                                            قوانین و مقررات را قبول می‌کنم.
                                        </Label>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Label md='4'><strong>کد تخفیف دارید؟</strong></Label>
                                        <Col md='6'>
                                            <Input type="text"
                                                   maxLength={15}
                                                   onChange={(e) => this.setState({discountCode: e.target.value})}/>
                                        </Col>
                                    </FormGroup>
                                </Form>
                                <Row>
                                    <Col md={4}>
                                        <Button color="success" onClick={this.pay}>
                                            {'پرداخت از طریق درگاه'}
                                        </Button>
                                    </Col>
                                    <Col md={4}/>
                                    <Col md={4}>
                                        <Link to={'/packages'}>
                                            <Button color="danger">انصراف</Button>
                                        </Link>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </CardBody>
                </Card>
            </div>
        )
    }

}

function select(state) {
    return {
        data: state.userReducer,
        package: state.packageReducer.package,
        currentlySending: state.homeReducer.currentlySending
    }
}

export default connect(select)(SelectedPackage)
