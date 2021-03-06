import React from "react"
import { graphql, QueryRenderer } from "react-relay"

// tslint:disable:no-unused-expression
import BidFlow from "../Containers/BidFlow"
BidFlow

import RegistrationFlow from "../Containers/RegistrationFlow"
RegistrationFlow

import Conversation from "../Containers/Conversation"
Conversation

import Gene from "../Containers/Gene"
Gene

import WorksForYou from "../Containers/WorksForYou"
WorksForYou

import Inquiry from "../Containers/Inquiry"
Inquiry

import Inbox from "../Containers/Inbox"
Inbox
// tslint:enable:no-unused-expression

import { EventStatus, ShowSorts } from "__generated__/CitySectionListQuery.graphql"
import { QueryRenderersBidFlowQuery } from "__generated__/QueryRenderersBidFlowQuery.graphql"
import { QueryRenderersCityBMWListQuery } from "__generated__/QueryRenderersCityBMWListQuery.graphql"
import { QueryRenderersCityFairListQuery } from "__generated__/QueryRenderersCityFairListQuery.graphql"
import { QueryRenderersCitySavedListQuery } from "__generated__/QueryRenderersCitySavedListQuery.graphql"
import { PartnerShowPartnerType } from "__generated__/QueryRenderersCitySectionListQuery.graphql"
import { QueryRenderersCitySectionListQuery } from "__generated__/QueryRenderersCitySectionListQuery.graphql"
import { QueryRenderersCollectionFullFeaturedArtistListQuery } from "__generated__/QueryRenderersCollectionFullFeaturedArtistListQuery.graphql"
import { QueryRenderersCollectionQuery } from "__generated__/QueryRenderersCollectionQuery.graphql"
import { QueryRenderersConversationQuery } from "__generated__/QueryRenderersConversationQuery.graphql"
import { QueryRenderersFairQuery } from "__generated__/QueryRenderersFairQuery.graphql"
import { QueryRenderersForYouQuery } from "__generated__/QueryRenderersForYouQuery.graphql"
import { QueryRenderersGeneQuery } from "__generated__/QueryRenderersGeneQuery.graphql"
import { QueryRenderersInboxQuery } from "__generated__/QueryRenderersInboxQuery.graphql"
import { QueryRenderersInquiryQuery } from "__generated__/QueryRenderersInquiryQuery.graphql"
import { QueryRenderersRegistrationFlowQuery } from "__generated__/QueryRenderersRegistrationFlowQuery.graphql"
import { QueryRenderersShowQuery } from "__generated__/QueryRenderersShowQuery.graphql"
import { QueryRenderersWorksForYouQuery } from "__generated__/QueryRenderersWorksForYouQuery.graphql"
import { BucketKey } from "lib/Scenes/Map/bucketCityResults"
import { Dimensions } from "react-native"
import { defaultEnvironment as environment } from "./createEnvironment"

export type RenderCallback = React.ComponentProps<typeof QueryRenderer>["render"]

interface RendererProps {
  render: RenderCallback
}

export interface BidderFlowRendererProps extends RendererProps {
  artworkID?: string
  saleID: string
}

export const RegistrationFlowRenderer: React.SFC<BidderFlowRendererProps> = ({ render, saleID }) => {
  return (
    <QueryRenderer<QueryRenderersRegistrationFlowQuery>
      environment={environment}
      query={graphql`
        query QueryRenderersRegistrationFlowQuery($saleID: String!) {
          sale(id: $saleID) {
            name
            ...RegistrationFlow_sale
          }
          me {
            ...RegistrationFlow_me
          }
        }
      `}
      cacheConfig={{ force: true }} // We want to always fetch latest sale registration status, CC info, etc.
      variables={{
        saleID,
      }}
      render={render}
    />
  )
}

export const BidFlowRenderer: React.SFC<BidderFlowRendererProps> = ({ render, artworkID, saleID }) => {
  // TODO: artworkID can be nil, so omit that part of the query if it is.
  return (
    <QueryRenderer<QueryRenderersBidFlowQuery>
      environment={environment}
      query={graphql`
        query QueryRenderersBidFlowQuery($artworkID: String!, $saleID: String!) {
          artwork(id: $artworkID) {
            sale_artwork: saleArtwork(saleID: $saleID) {
              ...BidFlow_sale_artwork
            }
          }
          me {
            ...BidFlow_me
          }
        }
      `}
      cacheConfig={{ force: true }} // We want to always fetch latest bid increments.
      variables={{
        artworkID,
        saleID,
      }}
      render={({ props, error, retry }) => {
        if (props) {
          // Note that we need to flatten the query above before passing into the BidFlow component.
          // i.e.: the `sale_artwork` is nested within `artwork`, but we want the sale_artwork itself as a prop.
          return render({
            props: {
              sale_artwork: props.artwork.sale_artwork,
              me: props.me,
            },
            error,
            retry,
          })
        } else {
          render({ props, error, retry })
        }
      }}
    />
  )
}

interface ConversationRendererProps extends RendererProps {
  conversationID: string
  cursor?: string
  count?: number
}

export const ConversationRenderer: React.SFC<ConversationRendererProps> = ({ render, conversationID }) => {
  return (
    <QueryRenderer<QueryRenderersConversationQuery>
      environment={environment}
      query={graphql`
        query QueryRenderersConversationQuery($conversationID: String!) {
          me {
            ...Conversation_me
          }
        }
      `}
      variables={{
        conversationID,
      }}
      render={render}
    />
  )
}

export const ForYouRenderer: React.SFC<RendererProps> = ({ render }) => {
  return (
    <QueryRenderer<QueryRenderersForYouQuery>
      environment={environment}
      query={graphql`
        query QueryRenderersForYouQuery {
          forYou: homePage {
            ...ForYou_forYou
          }
        }
      `}
      variables={{}}
      render={render}
    />
  )
}

interface GeneRendererProps extends RendererProps {
  geneID: string
  medium?: string
  price_range?: string
}

export const GeneRenderer: React.SFC<GeneRendererProps> = ({ render, geneID, medium, price_range }) => {
  return (
    <QueryRenderer<QueryRenderersGeneQuery>
      environment={environment}
      query={graphql`
        query QueryRenderersGeneQuery($geneID: String!, $medium: String, $price_range: String) {
          gene(id: $geneID) {
            ...Gene_gene @arguments(medium: $medium, priceRange: $price_range)
          }
        }
      `}
      variables={{
        geneID,
        medium,
        price_range,
      }}
      render={render}
    />
  )
}

interface WorksForYouRendererProps extends RendererProps {
  selectedArtist?: string
}

export const WorksForYouRenderer: React.SFC<WorksForYouRendererProps> = ({ render }) => {
  return (
    <QueryRenderer<QueryRenderersWorksForYouQuery>
      environment={environment}
      query={graphql`
        query QueryRenderersWorksForYouQuery {
          ...WorksForYou_query
        }
      `}
      variables={{}}
      render={render}
    />
  )
}

interface InquiryRendererProps extends RendererProps {
  artworkID: string
}

export const InquiryRenderer: React.SFC<InquiryRendererProps> = ({ render, artworkID }) => {
  return (
    <QueryRenderer<QueryRenderersInquiryQuery>
      environment={environment}
      query={graphql`
        query QueryRenderersInquiryQuery($artworkID: String!) {
          artwork(id: $artworkID) {
            ...Inquiry_artwork
          }
        }
      `}
      variables={{
        artworkID,
      }}
      render={render}
    />
  )
}

export const InboxRenderer: React.SFC<RendererProps> = ({ render }) => {
  return (
    <QueryRenderer<QueryRenderersInboxQuery>
      environment={environment}
      query={graphql`
        query QueryRenderersInboxQuery {
          me {
            ...Inbox_me
          }
        }
      `}
      variables={{}}
      render={render}
    />
  )
}

interface CollectionRendererProps extends RendererProps {
  collectionID: string
}

export const CollectionRenderer: React.SFC<CollectionRendererProps> = ({ collectionID, render }) => (
  <QueryRenderer<QueryRenderersCollectionQuery>
    environment={environment}
    query={graphql`
      query QueryRenderersCollectionQuery($collectionID: String!, $screenWidth: Int) {
        collection: marketingCollection(slug: $collectionID) {
          ...Collection_collection @arguments(screenWidth: $screenWidth)
        }
      }
    `}
    variables={{
      collectionID,
      screenWidth: Dimensions.get("screen").width,
    }}
    cacheConfig={{
      // Bypass Relay cache on retries.
      force: true,
    }}
    render={render}
  />
)

export const CollectionFullFeaturedArtistListRenderer: React.SFC<CollectionRendererProps> = ({
  collectionID,
  render,
}) => (
  <QueryRenderer<QueryRenderersCollectionFullFeaturedArtistListQuery>
    environment={environment}
    query={graphql`
      query QueryRenderersCollectionFullFeaturedArtistListQuery($collectionID: String!, $screenWidth: Int) {
        collection: marketingCollection(slug: $collectionID) {
          ...FullFeaturedArtistList_collection @arguments(screenWidth: $screenWidth)
        }
      }
    `}
    variables={{
      collectionID,
      screenWidth: Dimensions.get("screen").width,
    }}
    cacheConfig={{
      // Bypass Relay cache on retries.
      force: true,
    }}
    render={render}
  />
)

interface FairRendererProps extends RendererProps {
  fairID: string
}

export const FairRenderer: React.SFC<FairRendererProps> = ({ render, fairID }) => {
  return (
    <QueryRenderer<QueryRenderersFairQuery>
      environment={environment}
      query={graphql`
        query QueryRenderersFairQuery($fairID: String!) {
          fair(id: $fairID) {
            ...Fair_fair
          }
        }
      `}
      variables={{ fairID }}
      render={render}
    />
  )
}

interface ShowRendererProps extends RendererProps {
  showID: string
}

export const ShowRenderer: React.SFC<ShowRendererProps> = ({ render, showID }) => {
  return (
    <QueryRenderer<QueryRenderersShowQuery>
      environment={environment}
      query={graphql`
        query QueryRenderersShowQuery($showID: String!) {
          show(id: $showID) {
            ...Show_show
          }
        }
      `}
      variables={{ showID }}
      render={render}
    />
  )
}

interface CityBMWListProps extends RendererProps {
  citySlug: string
}
export const CityBMWListRenderer: React.SFC<CityBMWListProps> = ({ render, citySlug }) => {
  return (
    <QueryRenderer<QueryRenderersCityBMWListQuery>
      environment={environment}
      query={graphql`
        query QueryRenderersCityBMWListQuery($citySlug: String!) {
          city(slug: $citySlug) {
            ...CityBMWList_city
          }
        }
      `}
      variables={{ citySlug }}
      render={render}
    />
  )
}

interface CityFairListProps extends RendererProps {
  citySlug: string
}
export const CityFairListRenderer: React.SFC<CityFairListProps> = ({ render, citySlug }) => {
  return (
    <QueryRenderer<QueryRenderersCityFairListQuery>
      environment={environment}
      query={graphql`
        query QueryRenderersCityFairListQuery($citySlug: String!) {
          city(slug: $citySlug) {
            ...CityFairList_city
          }
        }
      `}
      variables={{ citySlug }}
      render={render}
    />
  )
}

interface CitySavedListProps extends RendererProps {
  citySlug: string
}
export const CitySavedListRenderer: React.SFC<CitySavedListProps> = ({ render, citySlug }) => {
  return (
    <QueryRenderer<QueryRenderersCitySavedListQuery>
      environment={environment}
      query={graphql`
        query QueryRenderersCitySavedListQuery($citySlug: String!) {
          ...CitySavedList_viewer
        }
      `}
      variables={{ citySlug }}
      render={render}
    />
  )
}

interface CitySectionListProps extends RendererProps {
  citySlug: string
  section: BucketKey
}
export const CitySectionListRenderer: React.SFC<CitySectionListProps> = ({ render, citySlug, section }) => {
  const variables: {
    citySlug: string
    partnerType?: PartnerShowPartnerType
    status?: EventStatus
    dayThreshold?: number
    sort?: ShowSorts
  } = { citySlug }

  switch (section) {
    case "museums":
      variables.partnerType = "MUSEUM"
      variables.status = "RUNNING"
      variables.sort = "PARTNER_ASC"
      break
    case "galleries":
      variables.partnerType = "GALLERY"
      variables.status = "RUNNING"
      variables.sort = "PARTNER_ASC"
      break
    case "closing":
      variables.status = "CLOSING_SOON"
      variables.sort = "END_AT_ASC"
      variables.dayThreshold = 7
      break
    case "opening":
      variables.status = "UPCOMING"
      variables.sort = "START_AT_ASC"
      variables.dayThreshold = 14
  }

  return (
    <QueryRenderer<QueryRenderersCitySectionListQuery>
      environment={environment}
      query={graphql`
        query QueryRenderersCitySectionListQuery(
          $citySlug: String!
          $partnerType: PartnerShowPartnerType
          $status: EventStatus
          $dayThreshold: Int
          $sort: ShowSorts
        ) {
          city(slug: $citySlug) {
            ...CitySectionList_city
              @arguments(partnerType: $partnerType, status: $status, sort: $sort, dayThreshold: $dayThreshold)
          }
        }
      `}
      variables={variables}
      render={render}
    />
  )
}
