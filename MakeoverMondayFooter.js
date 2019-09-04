function Logo(props) {
    return (
      <a href='https://public.tableau.com/profile/desiree.abbott#!/' title='My Tableau Public Portfolio'>
        <img src="https://raw.githubusercontent.com/callmedeeray/callmedeeray.github.io/master/CallMeDeeray_Logo_Color.png" height={props.height + 'px'}/>
      </a>
    );
}

function Credits(props) {
  return (
    <span className={"labelText-" + props.background} style={props.spanStyle}>
      Data:  <a href={props.dataLink} title={props.dataTitle}>{props.dataTitle}</a>
    </span>
  );
}

class MakeoverMondayFooter extends React.Component {
  render() {
    const spanStyle = {
      marginTop: +this.props.height*0.6 + 'px',
    };
    
    return (
      <div id="finePrint">
        <span id="credits">
          <Credits dataTitle={this.props.dataTitle} dataLink={this.props.dataLink} background={this.props.background} spanStyle={spanStyle} />
        </span>
        <span id="logoSpan">
          <span className={"labelText-" + this.props.background} style={spanStyle}>
            Viz by:    
          </span>
            <Logo height={this.props.height} />
        </span>
      </div>
    );
  }
}

// ReactDOM.render(
//   <MakeoverMondayFooter dataTitle='' dataLink='' height={window.innerHeight*0.05} background='light' />,
//   document.getElementById('root')
// );
