import React from "react"
import { AppRegistry, View, YellowBox } from "react-native"
import { Container as RelayContainer } from "react-relay"

import { SafeAreaInsets } from "lib/types/SafeAreaInsets"
import Consignments from "./Components/Consignments"
import Containers from "./Containers/"
import { ArtistQueryRenderer } from "./Containers/Artist"
import BidFlow from "./Containers/BidFlow"
import RegistrationFlow from "./Containers/RegistrationFlow"
import {
  BidderFlowRendererProps,
  BidFlowRenderer,
  CityBMWListRenderer,
  CityFairListRenderer,
  CitySavedListRenderer,
  CitySectionListRenderer,
  CollectionFullFeaturedArtistListRenderer,
  CollectionRenderer,
  ConversationRenderer,
  FairRenderer,
  GeneRenderer,
  InboxRenderer,
  InquiryRenderer,
  RegistrationFlowRenderer,
  ShowRenderer,
  WorksForYouRenderer,
} from "./relay/QueryRenderers"
import { ArtworkQueryRenderer } from "./Scenes/Artwork/Artwork"
import { ArtworkAttributionClassFAQRenderer } from "./Scenes/ArtworkAttributionClassFAQ"
import { CityView } from "./Scenes/City"
import { CityPicker } from "./Scenes/City/CityPicker"
import { CollectionContainer } from "./Scenes/Collection/Collection"
import { CollectionFeaturedArtistsContainer } from "./Scenes/Collection/Components/FullFeaturedArtistList"
import {
  FairArtistsRenderer,
  FairArtworksRenderer,
  FairBMWArtActivationRenderer,
  FairBoothRenderer,
  FairExhibitorsRenderer,
  FairMoreInfoRenderer,
} from "./Scenes/Fair"
import FavoritesScene from "./Scenes/Favorites"
import { Home } from "./Scenes/Home/Home"
import { MapContainer } from "./Scenes/Map"
import { BucketKey } from "./Scenes/Map/bucketCityResults"
import { PartnerRenderer } from "./Scenes/Partner"
import { PartnerLocationsRenderer } from "./Scenes/Partner/Screens/PartnerLocations"
import { PrivacyRequest } from "./Scenes/PrivacyRequest"
import { Search } from "./Scenes/Search"
import { ShowArtistsRenderer, ShowArtworksRenderer, ShowMoreInfoRenderer } from "./Scenes/Show"
import renderWithLoadProgress from "./utils/renderWithLoadProgress"
import { Schema, screenTrack as track } from "./utils/track"

YellowBox.ignoreWarnings([
  "Warning: RelayResponseNormalizer: Payload did not contain a value for field `id: id`. Check that you are parsing with the same query that was used to fetch the payload.",
  // Deprecated, we'll transition when it's removed.
  "Warning: ListView is deprecated and will be removed in a future release. See https://fb.me/nolistview for more information",

  // RN 0.59.0 ships with RNCameraRoll with this issue: https://github.com/facebook/react-native/issues/23755
  // We can remove this once this PR gets shipped and we update: https://github.com/facebook/react-native/pull/24314
  "Module RCTImagePickerManager requires main queue setup since it overrides `init`",

  // RN 0.59.0 ships with this bug, see: https://github.com/facebook/react-native/issues/16376
  "RCTBridge required dispatch_sync to load RCTDevLoadingView. This may lead to deadlocks",

  // The following two items exist in node_modules. Once this PR is merged, to make warnings opt-in, we can ignore: https://github.com/facebook/metro/issues/287

  // react-native-sentry ships with this error, tracked here: https://github.com/getsentry/react-native-sentry/issues/479
  "Require cycle: node_modules/react-native-sentry/lib/Sentry.js -> node_modules/react-native-sentry/lib/RavenClient.js -> node_modules/react-native-sentry/lib/Sentry.js",
  // RN 0.59.0 ships with this issue, which has been effectively marked as #wontfix: https://github.com/facebook/react-native/issues/23130
  "Require cycle: node_modules/react-native/Libraries/Network/fetch.js -> node_modules/react-native/Libraries/vendor/core/whatwg-fetch.js -> node_modules/react-native/Libraries/Network/fetch.js",

  // This is for the Artist page, which will likely get redone soon anyway.
  "VirtualizedLists should never be nested inside plain ScrollViews with the same orientation - use another VirtualizedList-backed container instead.",
])

interface ArtworkProps {
  artworkID: string
  isVisible: boolean
}

const Artwork: React.SFC<ArtworkProps> = props => <ArtworkQueryRenderer {...props} />

interface PartnerProps {
  partnerID: string
  safeAreaInsets: SafeAreaInsets
  isVisible: boolean
}

const Partner: React.SFC<PartnerProps> = props => <PartnerRenderer {...props} />

interface PartnerLocationsProps {
  partnerID: string
  safeAreaInsets: SafeAreaInsets
  isVisible: boolean
}
const PartnerLocations: React.SFC<PartnerLocationsProps> = props => <PartnerLocationsRenderer {...props} />

const Inbox: React.SFC<{}> = track<{}>(() => {
  return { context_screen: Schema.PageNames.InboxPage, context_screen_owner_type: null }
})(props => <InboxRenderer {...props} render={renderWithLoadProgress(Containers.Inbox, props)} />)

interface GeneProps {
  geneID: string
  refineSettings: { medium: string; price_range: string }
}

const Gene: React.SFC<GeneProps> = track<GeneProps>(props => {
  return {
    context_screen: Schema.PageNames.GenePage,
    context_screen_owner_slug: props.geneID,
    context_screen_owner_type: Schema.OwnerEntityTypes.Gene,
  }
})(({ geneID, refineSettings: { medium, price_range } }) => {
  const initialProps = { geneID, medium, price_range }
  return <GeneRenderer {...initialProps} render={renderWithLoadProgress(Containers.Gene, initialProps)} />
})

// FIXME: This isn't being used
// const Sale: React.SFC<{ saleID: string }> = ({ saleID }) => {
//   const initialProps = { saleID }
//   return <SaleRenderer {...initialProps} render={renderWithLoadProgress(Containers.Sale, initialProps)} />
// }

// TODO: This was required to trigger the 1px wake-up hack (in case the scrollview goes blank)
//
//     this.renderFetched = data => <Containers.WorksForYou {...data} trigger1pxScrollHack={this.props.trigger1pxScrollHack} />
//
// FIXME: Is this really still being used?
const WorksForYou: React.SFC<{ selectedArtist: string }> = props => (
  <WorksForYouRenderer
    {...props}
    render={renderWithLoadProgress(
      query => (
        <Containers.WorksForYou query={query as any} />
      ),
      props
    )}
  />
)

interface InquiryProps {
  artworkID: string
}
const Inquiry: React.SFC<InquiryProps> = track<InquiryProps>(props => {
  return {
    context_screen: Schema.PageNames.InquiryPage,
    context_screen_owner_slug: props.artworkID,
    context_screen_owner_type: Schema.OwnerEntityTypes.Artwork,
  }
})(props => <InquiryRenderer {...props} render={renderWithLoadProgress(Containers.Inquiry, props)} />)

interface ConversationProps {
  conversationID: string
}
const Conversation: React.SFC<ConversationProps> = track<ConversationProps>(props => {
  return {
    context_screen: Schema.PageNames.ConversationPage,
    context_screen_owner_id: props.conversationID,
    context_screen_owner_type: Schema.OwnerEntityTypes.Conversation,
  }
})(props => <ConversationRenderer {...props} render={renderWithLoadProgress(Containers.Conversation, props)} />)

const MyProfile = Containers.MyProfile

interface CollectionProps {
  collectionID: string
}

const Collection: React.SFC<CollectionProps> = ({ collectionID }) => {
  return (
    <CollectionRenderer
      collectionID={collectionID}
      render={renderWithLoadProgress(CollectionContainer, { collectionID })}
    />
  )
}

const FullFeaturedArtistList: React.SFC<CollectionProps> = ({ collectionID }) => {
  return (
    <CollectionFullFeaturedArtistListRenderer
      collectionID={collectionID}
      render={renderWithLoadProgress(CollectionFeaturedArtistsContainer, { collectionID })}
    />
  )
}

/*
 * Route bid/register requests coming from the Emission pod to either a BidFlow
 * or RegisterFlow component with an appropriate query renderer
 */
type BidderFlowIntent = "bid" | "register"
interface BidderFlowProps {
  artworkID?: string
  saleID: string
  intent: BidderFlowIntent
}

interface BidderFlow {
  queryRenderer: React.ComponentType<BidderFlowRendererProps>
  container: RelayContainer<any>
}

const BidderFlows: { [BidderFlowIntent: string]: BidderFlow } = {
  bid: {
    queryRenderer: BidFlowRenderer,
    container: BidFlow,
  },
  register: {
    queryRenderer: RegistrationFlowRenderer,
    container: RegistrationFlow,
  },
}

const BidderFlow: React.SFC<BidderFlowProps> = ({ intent, ...restProps }) => {
  const { queryRenderer: Renderer, container: Container } = BidderFlows[intent]
  return <Renderer {...restProps} render={renderWithLoadProgress(Container)} />
}

interface FairProps {
  fairID: string
}

const Fair: React.SFC<FairProps> = ({ fairID }) => {
  return <FairRenderer fairID={fairID} render={renderWithLoadProgress(Containers.Fair, { fairID })} />
}

interface ShowProps {
  showID: string
}

const Show: React.SFC<ShowProps> = ({ showID }) => {
  return <ShowRenderer showID={showID} render={renderWithLoadProgress(Containers.Show, { showID })} />
}

interface ShowArtistsProps {
  showID: string
}
const ShowArtists: React.SFC<ShowArtistsProps> = ({ showID }) => {
  return <ShowArtistsRenderer showID={showID} />
}

interface ShowArtworksProps {
  showID: string
}
const ShowArtworks: React.SFC<ShowArtworksProps> = ({ showID }) => {
  return <ShowArtworksRenderer showID={showID} />
}

interface ShowMoreInfoProps {
  showID: string
}
const ShowMoreInfo: React.SFC<ShowMoreInfoProps> = ({ showID }) => {
  return <ShowMoreInfoRenderer showID={showID} />
}

interface CityFairListProps {
  citySlug: string
}
const CityFairList: React.SFC<CityFairListProps> = ({ citySlug }) => {
  return (
    <CityFairListRenderer citySlug={citySlug} render={renderWithLoadProgress(Containers.CityFairList, { citySlug })} />
  )
}

interface CitySectionListProps {
  citySlug: string
  section: BucketKey
}
const CitySectionList: React.SFC<CitySectionListProps> = ({ citySlug, section }) => {
  return (
    <CitySectionListRenderer
      citySlug={citySlug}
      section={section}
      render={renderWithLoadProgress(Containers.CitySectionList, { citySlug, section })}
    />
  )
}

interface FairBoothProps {
  fairBoothID: string
}

const FairBooth: React.SFC<FairBoothProps> = ({ fairBoothID }) => {
  return <FairBoothRenderer showID={fairBoothID} />
}

interface FairArtistsProps {
  fairID: string
}

const FairArtists: React.SFC<FairArtistsProps> = track<FairArtistsProps>(props => {
  return {
    context_screen: Schema.PageNames.FairAllArtistsPage,
    context_screen_owner_slug: props.fairID,
    context_screen_owner_type: Schema.OwnerEntityTypes.Fair,
  }
})(({ fairID }) => {
  return <FairArtistsRenderer fairID={fairID} />
})

interface FairArtworksProps {
  fairID: string
}

const FairArtworks: React.SFC<FairArtworksProps> = ({ fairID }) => {
  return <FairArtworksRenderer fairID={fairID} />
}

interface FairExhibitorsProps {
  fairID: string
}

const FairExhibitors: React.SFC<FairExhibitorsProps> = ({ fairID }) => {
  return <FairExhibitorsRenderer fairID={fairID} />
}

interface CityBMWListProps {
  citySlug: string
}
const CityBMWList: React.SFC<CityBMWListProps> = ({ citySlug }) => {
  return (
    <CityBMWListRenderer citySlug={citySlug} render={renderWithLoadProgress(Containers.CityBMWList, { citySlug })} />
  )
}

interface FairBMWArtActivationProps {
  fairID: string
}
const FairBMWArtActivation: React.SFC<FairBMWArtActivationProps> = ({ fairID }) => {
  return <FairBMWArtActivationRenderer fairID={fairID} />
}

interface CitySavedListProps {
  citySlug: string
}
const CitySavedList: React.SFC<CitySavedListProps> = ({ citySlug }) => {
  return (
    <CitySavedListRenderer
      citySlug={citySlug}
      render={renderWithLoadProgress(
        props => (
          <Containers.CitySavedList viewer={props as any} citySlug={citySlug} />
        ),
        { citySlug }
      )}
    />
  )
}

interface SearchWithTrackingProps {
  safeAreaInsets: SafeAreaInsets
}
const SearchWithTracking: React.SFC<SearchWithTrackingProps> = track<SearchWithTrackingProps>(() => {
  return {
    context_screen: Schema.PageNames.Search,
    context_screen_owner_type: Schema.OwnerEntityTypes.Search,
  }
})(props => {
  return <Search {...props} />
})

AppRegistry.registerComponent("Consignments", () => Consignments)
AppRegistry.registerComponent("Artist", () => ArtistQueryRenderer)
AppRegistry.registerComponent("Artwork", () => Artwork)
AppRegistry.registerComponent("ArtworkAttributionClassFAQ", () => ArtworkAttributionClassFAQRenderer)
AppRegistry.registerComponent("Home", () => Home)
AppRegistry.registerComponent("Gene", () => Gene)
AppRegistry.registerComponent("WorksForYou", () => WorksForYou)
AppRegistry.registerComponent("MyProfile", () => MyProfile)
AppRegistry.registerComponent("MySellingProfile", () => () => <View />)
AppRegistry.registerComponent("Inbox", () => Inbox)
AppRegistry.registerComponent("Conversation", () => Conversation)
AppRegistry.registerComponent("Inquiry", () => Inquiry)
AppRegistry.registerComponent("Partner", () => Partner)
AppRegistry.registerComponent("PartnerLocations", () => PartnerLocations)
AppRegistry.registerComponent("Favorites", () => FavoritesScene)
// TODO: Change everything to BidderFlow? AuctionAction?
AppRegistry.registerComponent("BidFlow", () => BidderFlow)
AppRegistry.registerComponent("Fair", () => Fair)
AppRegistry.registerComponent("FairMoreInfo", () => FairMoreInfoRenderer)
AppRegistry.registerComponent("FairBooth", () => FairBooth)
AppRegistry.registerComponent("FairArtists", () => FairArtists)
AppRegistry.registerComponent("FairArtworks", () => FairArtworks)
AppRegistry.registerComponent("FairExhibitors", () => FairExhibitors)
AppRegistry.registerComponent("FairBMWArtActivation", () => FairBMWArtActivation)
AppRegistry.registerComponent("Search", () => SearchWithTracking)
AppRegistry.registerComponent("Show", () => Show)
AppRegistry.registerComponent("ShowArtists", () => ShowArtists)
AppRegistry.registerComponent("ShowArtworks", () => ShowArtworks)
AppRegistry.registerComponent("ShowMoreInfo", () => ShowMoreInfo)
AppRegistry.registerComponent("Map", () => MapContainer)
AppRegistry.registerComponent("City", () => CityView)
AppRegistry.registerComponent("CityPicker", () => CityPicker)
AppRegistry.registerComponent("CityBMWList", () => CityBMWList)
AppRegistry.registerComponent("CityFairList", () => CityFairList)
AppRegistry.registerComponent("CitySavedList", () => CitySavedList)
AppRegistry.registerComponent("CitySectionList", () => CitySectionList)
AppRegistry.registerComponent("Collection", () => Collection)
AppRegistry.registerComponent("PrivacyRequest", () => PrivacyRequest)
AppRegistry.registerComponent("FullFeaturedArtistList", () => FullFeaturedArtistList)
