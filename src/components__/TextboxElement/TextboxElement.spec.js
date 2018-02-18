import TextboxElement from './TextboxElement';

const {
  renderIntoDocument,
  findRenderedDOMComponentWithTag,
  Simulate
} = TestUtils;

const mockFunction = () => {};
const props = {
  placeholder: 'Text',
  onChange: mockFunction,
  className: 'testClass',
  id: '1'
}

describe('HTML ELEMENT: Textbox Element Component', () => {
  // it('should have default properties', () => {
  //   var component = renderIntoDocument(
  //     <TextboxElement />
  //   );

  //   expect(component.props).to.have.all.keys(
  //     'placeholder',
  //     'onChange',
  //     'className',
  //     'id'
  //   );

  //   expect(component.props.className).to.equal('');
  //   expect(component.props.onChange).to.be.a('function');
  //   expect(component.props.placeholder).to.equal('');
  //   expect(component.props.id).to.equal('');
  // });

  it('should take input to override default properties', () => {
    const component = renderIntoDocument(
      <TextboxElement {...props}  />
    );

    expect(component.props.items).to.deep.equal(props.items);
    expect(component.props.onChange).to.equal(mockFunction);
    expect(component.props.defaultValue).to.deep.equal(props.defaultValue);
    expect(component.props.className).to.equal(props.className);
    expect(component.props.id).to.equal(props.id);
  });

  it('should fire onChange function when input changes', () => {
    const props = {
      placeholder: 'Text',
      onChange: sinon.spy(),
      className: 'testClass',
      id: '1'
    }

    const component = renderIntoDocument(
      <TextboxElement {...props}  />
    );

    const input = findRenderedDOMComponentWithTag(component, 'input');

    Simulate.change(input, {target: {value: 'test'}});
    props.onChange.calledOnce.should.equal(true);
    Simulate.change(input, {target: {value: 'test again'}});
    props.onChange.calledTwice.should.equal(true);
  });
});

