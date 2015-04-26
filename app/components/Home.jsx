import { Reapp, React, View} from 'reapp-kit';
import Button from 'reapp-ui/components/Button';
import Modal from 'reapp-ui/components/Modal';


var MapView = React.createClass({

    componentDidMount: function() {
      
      var geocoder = new google.maps.Geocoder();
      var sitepoint = new google.maps.LatLng(-37.805723, 144.985360);

      document.getElementById('info').innerHTML = '-37.805723, 144.985360';
      
      

      var mapOptions = {
              zoom: 3,
              center: sitepoint
          },
          map = new google.maps.Map(React.findDOMNode(this), mapOptions),
          marker = new google.maps.Marker({
           map:map,
           draggable:true,
           animation: google.maps.Animation.DROP,
           position: sitepoint
      });

      geocoder.geocode({
        latLng: marker.getPosition()
      }, function(responses) {
        if (responses && responses.length > 0) {
            document.getElementById('address').innerHTML = responses[0].formatted_address;
        }
      });

      google.maps.event.addListener(marker, 'dragend', function(e) {

    var obj = marker.getPosition();
    document.getElementById('info').innerHTML = e.latLng;

    map.panTo(marker.getPosition());

    geocoder.geocode({
        latLng: obj
    }, function(responses) {

        if (responses && responses.length > 0) {
            document.getElementById('address').innerHTML = responses[0].formatted_address;
        }
      
    });
});

      this.setState({
        map: map
      });
    },

    render: function() {
        return (
            <div id="map"><span>Map Would be Here !!</span></div>
        );
    }
});

var Home = React.createClass({


  savePosition: function() {
    var wishRef = new Firebase('https://blistering-heat-2473.firebaseio.com/Position');
    var pos = document.getElementById('info').innerHTML;

    var address = document.getElementById('address').innerHTML;
    wishRef.push({
        'Position': pos,
        'Address': address
    });

    this.setState({ modal: true });
},
getInitialState: function() {
    return {
      modal: false
    };
  },

  render: function() {
    return (
      <View title="Where Am I">
        {this.state.modal &&
          <Modal
            title="Coordinates Saved."
            onClose={() => this.setState({ modal: false })}>
          </Modal>
        }

        <MapView />



        <div style={{width:100 + '%',height:100 + 'px',margin: 0 + ' auto',padding:10 + 'px'}} id="infoPanel">

            <div>
              <span><b>Position:</b></span>
              <span  id="info"></span>
            </div>

            &nbsp;

            <div>
              <span><b>Address:</b></span>
              <span  id="address"></span>
            </div>

        </div>
        <br/>
        <Button onTap={this.savePosition}>Save </Button>
      </View>
    );
  }
});

export default Reapp(Home);