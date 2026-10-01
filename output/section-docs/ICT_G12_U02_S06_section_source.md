# ICT_G12_U02_S06 — Fog Computing

Grade 12 ICT (Ethiopian curriculum). Textbook sub-chapter: 2.3 Fog Computing.

## MUST-COVER CHECKLIST (teach every item)
- Fog computing
- Cloud computing

## LMS LESSON (authoritative)
LEAD

Fog Computing, a term coined by Cisco Systems, is a decentralised computing infrastructure in which data, compute, storage, and applications are distributed between the data source and the cloud. The name derives from the analogy that a fog is a cloud that is close to the ground, reflecting the role of fog computing as an intermediate layer that sits between cloud data centres and edge devices. Fog computing extends the cloud paradigm to the network edge, enabling local processing and storage that reduces the volume of data that must be transmitted to the cloud and minimises latency for time-sensitive applications. In a fog computing architecture, fog nodes are deployed at various points within the network, such as routers, switches, base stations, or dedicated servers, and they provide computing, storage, and networking services to nearby edge devices.

PARAGRAPHS

Fog computing is especially valuable in scenarios that require low latency, real-time processing, or operation in bandwidth-constrained environments. In industrial automation, fog nodes can process sensor data from manufacturing equipment locally, enabling immediate detection of anomalies and rapid shutdown to prevent accidents. In autonomous vehicles, fog computing supports split-second decision-making by processing data from cameras, lidar, and radar sensors within the vehicle itself or from nearby roadside fog nodes. In smart grid applications, fog computing enables real-time monitoring and control of electricity distribution, allowing utilities to balance loads, integrate renewable energy sources, and respond to faults within milliseconds. In healthcare, fog nodes in hospitals can process patient monitoring data locally, generating alerts for medical staff without the delays inherent in sending data to a distant cloud server.

ETHIOPIAN CONTEXT

🇪🇩 Ethiopian Context Fog computing holds particular promise for Ethiopian agriculture, where smallholder farmers face challenges related to unreliable internet connectivity, limited access to electricity, and the need for timely, locally relevant information. In a typical smart agriculture deployment, IoT sensors deployed across farm fields collect data on soil moisture, temperature, humidity, and nutrient levels. Rather than transmitting all raw data to a distant cloud server, a local fog node can process this data on-site, generating immediate recommendations for irrigation scheduling or fertiliser application. The fog node then transmits only condensed summaries and alerts to the cloud for long-term analysis and record-keeping. This architecture is especially valuable in rural Ethiopian farming communities where internet connectivity may be intermittent and expensive. Projects such as the Ethiopian Institute of Agricultural Research's smart farming initiatives could benefit significantly from fog computing architectures that enable real-time decision support even in areas with limited cloud connectivity. Furthermore, fog nodes can continue operating during network outages, ensuring that critical monitoring and alerting functions remain available.

KEY CONCEPTS

Fog Computing versus Cloud Computing. While both fog computing and cloud computing involve virtualised computing resources and support multi-tenancy, they differ in several critical respects. Cloud computing typically operates in large, centralised data centres that may be located far from end users, resulting in higher latency for data transmission. Fog computing operates closer to the data source, often within the local area network, providing response times measured in milliseconds rather than seconds. Cloud computing offers virtually unlimited storage and processing capacity, whereas fog computing has more limited resources due to the smaller form factor of fog nodes. Cloud computing is better suited for historical data analysis and long-term storage, while fog computing excels at real-time processing and immediate decision-making. Fog computing also reduces bandwidth consumption by processing data locally and sending only aggregated summaries to the cloud, which is particularly important in environments with limited or expensive network connectivity.

## TEXTBOOK CONTENT (authoritative)
2.3. Fog Computing
Brainstorming 2.3
 What are the difference and similarities between Cloud Computing and
Fog Computing?
Fog computing is an extension of the cloud. Cloud Computing relies heavily on the
bandwidth made available, which depends on the capacity of the network service
provider. With billions of users processing, sending, and receiving data in and out
of the cloud, the system becomes increasingly congested.
Fog computing uses the concept of ‘fog nodes’ which are located closer to the
data source and have a higher processing and storage capability. Fog provides the

I nformatIon technology grade 12 ~ Student textbook 47
missing link for what data needs to be pushed to the cloud, and that can be analyzed
locally, at the edge. This makes fog nodes to process data quicker than sending the
request to the cloud for centralized processing.
What distinguishes fog computing from cloud computing is its closer proximity to
small end-users, its wider consumer reach, and better mobility. Rather than requiring
devices to go through the network backbone infrastructure, fog computing permits
devices to connect directly with their destination with ease and allows them to
handle their connections and tasks in any way they see fit. As a result, fog computing
improves the quality of service, reduces latency, and enhance user experience.
Fog computing smoothly supports
the emerging Internet of Things
(IoT) physical things (vehicles,
home appliances, and even clothes)
that are embedded with sensors to
enable them to send/receive data.
This advantage makes it easier to
run a real-time, Big-Data operation
with the ability to support billions of
nodes in highly dynamic and diverse
environments.
For example – we can apply fog computing in video surveillance, where continuous
streams of videos are large and cumbersome to transfer across networks.
Activity 2.4
1. Why do we need to use fog computing instead of cloud computing?
2. Due to the introduction of fog computing, what types of cloud services
will be more efficient and usable? Bring real-life examples based on
your previous online service user experiences.

I nformatIon technology grade 12 ~ Student textbook 48
