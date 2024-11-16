import {Helmet,HelmetProvider} from "react-helmet-async";

const MetaComponent = ({title="AmazingKart..." ,description="AmazingKart E comm Website"}) => {
    return (
    <HelmetProvider>
          <Helmet>
             <title>{title}</title>
             <meta name="description" content={description}/>
          </Helmet>
    </HelmetProvider>

    );
}

export default MetaComponent;